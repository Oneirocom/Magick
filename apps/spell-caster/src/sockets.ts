import { buildMagickInterface } from '../../server/src/spells/buildMagickInterface'
// import io from 'socket.io'
import { SpellManager } from '@magickml/core'

const handleSockets = (app: any) => {
  return (io: any) => {
    // Another gross 'any' here
    io.on('connection', async function (socket: any) {
      console.log('CONNECTION ESTABLISHED')
      // Disable auth for now
      // const sessionId = socket.handshake.headers.authorization.split(' ')[1]

      // if (!sessionId) throw new Error('No session id provided for handshake')
      // Authenticate with the auth headers here

      // hard coding user for now.
      const user = {
        id: '123',
      }
      // Attach the user info to the params or use in services
      socket.feathers.user = user

      // probably need to move interface instantiation into the runner rather than the spell manager.
      // Doing it this way makes the interface shared across all spells
      // Which messes up state stuff.
      const magickInterface = buildMagickInterface({})
      const spellManager = new SpellManager({ magickInterface, socket })

      app.userSpellManagers.set(user.id, spellManager)

      socket.emit('connected')
    })
  }
}

export default handleSockets
