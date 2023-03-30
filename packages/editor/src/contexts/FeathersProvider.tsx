import {
  Application,
  feathers,
  TransportConnection,
} from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import type { SocketService } from '@feathersjs/socketio-client'
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

import { LoadingScreen } from '@magickml/client-core'
import { useConfig } from './ConfigProvider'
import { SpellInterface } from '@magickml/engine'

// todo unify this type with the server type in spells
type SaveDiffData = {
  name: string
  diff: Record<string, any>
  projectId: string
}

type SaveDiffParams = Record<string, any>

type ServiceTypes = {
  // The type is a Socket service extended with custom methods
  spells: SocketService & {
    saveDiff(data: SaveDiffData, params: SaveDiffParams): Promise<SpellInterface>
  }
}

const configureCustomServices = (
  app: Application<any, any>,
  socketClient: TransportConnection<any>
) => {
  app.use('spells', socketClient.service('spells'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'saveDiff'],
  })
}

const buildFeathersClient = async (config, token) => {
  const socket = io(config.apiUrl, {
    // Send the authorization header in the initial connection request
    transportOptions: {
      polling: {
        extraHeaders: {
          authorization: `Bearer ${token}`,
        },
      },
    },
  })
  const app = feathers<ServiceTypes>()
  const socketClient = socketio(socket, { timeout: 10000 })
  // todo this needs more than an any here.  Super hacky.
  app.configure(socketClient as any)

  configureCustomServices(app, socketClient)

  // No idea how to type feathers to add io properties to root client.
  return app as any
}

interface FeathersContext {
  client: any | null
}

const Context = createContext<FeathersContext>(undefined!)

export const useFeathers = () => useContext(Context)

// Might want to namespace these
const FeathersProvider = ({ children, token }) => {
  const config = useConfig()
  const [client, setClient] = useState<FeathersContext['client']>(null)

  useEffect(() => {
    // We only want to create the feathers connection once we have a user to handle
    ;(async () => {
      const client = await buildFeathersClient(config, token)

      client.io.on('connect', () => {
        setClient(client)
      })

      client.io.on('reconnect', () => {
        console.log('Reconnected to the server')
        setClient(client)
      })

      client.io.on('disconnect', () => {
        console.log("We've been disconnected from the server")
        setTimeout(() => {
          console.log('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.io.on('error', error => {
        console.log('Connection error: ' + error + '\n trying to reconnect...')
        setTimeout(() => {
          console.log('Reconnecting...')
          client.io.connect()
        }, 1000)
      })
    })()
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  if (!client) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  return <FeathersProvider {...props} />
}

export default ConditionalProvider
