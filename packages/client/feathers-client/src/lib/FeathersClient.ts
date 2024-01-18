import {
  Application,
  TransportConnection,
  feathers,
} from '@feathersjs/feathers'
import socketio, { SocketService } from '@feathersjs/socketio-client'
import { io } from 'socket.io-client'

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
    saveDiff(data: SaveDiffData, params: SaveDiffParams): Promise<any>
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

  app.use('events', socketClient.service('events'), {
    methods: ['find', 'get', 'create', 'patch', 'remove'],
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
      'message',
    ],
    events: ['log', 'result', 'spell', 'event', 'error', 'warn'],
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

// FeathersClientSingleton.js
class FeathersClientSingleton {
  static instance: FeathersClientSingleton
  client: Application | null = null
  constructor() {
    if (FeathersClientSingleton.instance) {
      return FeathersClientSingleton.instance
    }

    this.client = null
    FeathersClientSingleton.instance = this
  }

  async initialize(token, config) {
    if (this.client) return this.client

    const client = await buildFeathersClient(config, token)

    // Add all the event listeners like 'connect', 'reconnect', etc...

    this.client = client
    return this.client as Application
  }

  getClient() {
    if (!this.client) {
      throw new Error("Feathers client hasn't been initialized yet.")
    }

    return this.client
  }
}

const instance = new FeathersClientSingleton()

export default instance
