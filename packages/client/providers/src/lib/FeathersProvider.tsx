// DOCUMENTED
import {
  Application,
  feathers,
  TransportConnection,
} from '@feathersjs/feathers'
import type { SocketService } from '@feathersjs/socketio-client'
import socketio from '@feathersjs/socketio-client'
import { getLogger, SpellInterface } from 'shared/core'
import { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useConfig } from './ConfigProvider'
import { LoadingScreen } from 'client/core'

/**
 * SaveDiffData type definition.
 */
type SaveDiffData = {
  name: string
  diff: Record<string, any>
  projectId: string
}

/**
 * SaveDiffParams type definition.
 */
type SaveDiffParams = Record<string, any>

/**
 * ServiceTypes type definition.
 */
type ServiceTypes = {
  // The type is a Socket service extended with custom methods
  spells: SocketService & {
    saveDiff(
      data: SaveDiffData,
      params: SaveDiffParams
    ): Promise<SpellInterface>
  }
}

/**
 * Configure custom services.
 *
 * @param app - Feathers application instance
 * @param socketClient - TransportConnection instance
 */
const configureCustomServices = (
  app: Application<any, any>,
  socketClient: TransportConnection<any>
): void => {
  app.use('spells', socketClient.service('spells'), {
    methods: ['find', 'get', 'create', 'patch', 'remove', 'saveDiff'],
  })

  app.use('agents', socketClient.service('agents'), {
    methods: [
      'find',
      'get',
      'create',
      'patch',
      'remove',
      'log',
      'run',
      'subscribe',
      'command',
    ],
    events: ['log', 'result', 'spell'],
  })
  app.use('request', socketClient.service('request'), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  })
}

/**
 * Build Feathers client connection.
 *
 * @param config - Application configuration object.
 * @param token - API token.
 * @returns Feathers client
 */
const buildFeathersClient = async (config, token): Promise<any> => {
  const socket = io(`${config.apiUrl}?token=${token}`, {
    transports: ['websocket'],
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  })
  const app = feathers<ServiceTypes>()
  const socketClient = socketio(socket, { timeout: 10000 })
  // todo this needs more than an<any> here.  Super hacky.
  app.configure(socketClient as any)

  configureCustomServices(app, socketClient)

  // No idea how to type feathers to add io properties to root client.
  return app
}

interface FeathersContext {
  client: any | null
}

/**
 * Feathers Context definition
 */
const Context = createContext<FeathersContext>(undefined!)

/**
 * Custom hook for Feathers Context
 */
export const useFeathers = (): FeathersContext => useContext(Context)

/**
 * FeathersProvider component
 * @props children, token
 */
export const FeathersProvider = ({ children, token }): JSX.Element => {
  const config = useConfig()
  const [client, setClient] = useState<FeathersContext['client']>(null)
  const logger = getLogger()

  useEffect(() => {
    ; (async (): Promise<void> => {
      const client = await buildFeathersClient(config, token)

      client.io.on('connect', async (): Promise<void> => {
        setClient(client)
      })

      client.io.on('reconnect', (): void => {
        logger.info('Reconnected to the server')
        setClient(client)
      })

      client.io.on('disconnect', (): void => {
        logger.info("We've been disconnected from the server")
        setTimeout((): void => {
          logger.info('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.io.on('error', (error): void => {
        logger.info(`Connection error: ${error} \n trying to reconnect...`)
        setTimeout((): void => {
          logger.info('Reconnecting...')
          client.io.connect()
        }, 1000)
      })

      client.service('agents').on('log', (data): void => {
        logger.info('agents log', data)
      })
    })()
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  if (!client) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}
