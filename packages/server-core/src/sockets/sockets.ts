// import io from 'socket.io'
import { SpellManager } from '@magickml/engine'
import { buildMagickInterface } from '../helpers/buildMagickInterface'

import { v4 } from 'uuid'

const isSingleUserMode = process.env.SINGLE_USER_MODE === 'true'

const handleSockets = (app: any) => {
  return (io: any) => {
    // Another gross 'any' here
    io.on('connection', async function (socket: any) {
      console.log('CONNECTION ESTABLISHED')
      // Disable auth for now

      // todo wound up using a custom header here for the handshake.
      // Using the standard authorization header was causing issues with feathers auth
      const sessionId = socket.handshake.headers.authorization.split(' ')[1]

      // auth services will verify the token
      const payload = await app
        .service('authentication')
        .verifyAccessToken(sessionId)

      // user will be set to the payload if we are not in single user mode
      let user

      // Single user mode is for local usage of magick.  If we are in the cloud, we want auth here.
      if (isSingleUserMode) {
        const id = v4()
        user = {
          id: id,
        }
      } else {
        if (!sessionId) throw new Error('No session id provided for handshake')
        user = payload.user
      }
      // Attach the user info to the params or use in services
      socket.feathers.user = user

      const magickInterface = buildMagickInterface({}) as any

      // probably need to move interface instantiation into the runner rather than the spell manager.
      // Doing it this way makes the interface shared across all spells
      // Which messes up state stuff.
      const spellManager = new SpellManager({ socket, magickInterface })

      app.userSpellManagers.set(user.id, spellManager)

      socket.emit('connected')
    })
  }
}

export default handleSockets
