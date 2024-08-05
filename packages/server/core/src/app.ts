import checkPermissions from 'feathers-permissions'
import { authenticate } from '@feathersjs/authentication'
import { NotAuthenticated } from '@feathersjs/errors/lib'
import { HookContext } from '@feathersjs/feathers'
import { feathers } from '@feathersjs/feathers/lib'
import {
  bodyParser,
  cors,
  errorHandler,
  koa,
  parseAuthentication,
  rest,
} from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import pino from 'pino'
import Redis from 'ioredis'
import Keyv from 'keyv'

import { prismaCore } from '@magickml/server-db'
import { RedisPubSub } from '@magickml/redis-pubsub'
import {
  REDIS_URL,
  API_ACCESS_KEY,
  PAGINATE_MAX,
  PAGINATE_DEFAULT,
  DATABASE_URL,
} from '@magickml/server-config'
import { createPosthogClient } from '@magickml/server-event-tracker'
import { getLogger } from '@magickml/server-logger'
import { CredentialsManager } from '@magickml/credentials'
import { stringify } from '@magickml/utils'
import { AgentCommander } from '@magickml/agent-commander'

import { dbClient } from './dbClient'
import type { Application } from './declarations'
import { logError } from './hooks'
import channels from './sockets/channels'
import { authentication } from './auth/authentication'
import { services } from './services'
import handleSockets from './sockets/sockets'

import { authenticateApiKey } from './hooks/authenticateApiKey'
import { SeraphCore } from '@magickml/seraph'
import feathersSync from './lib/feathersSync'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

// Initialize the Feathers Koa app
export const app: Application = koa(feathers())

export type Environment = 'default' | 'server' | 'agent'

declare module './declarations' {
  interface Configuration {
    pubsub: RedisPubSub
    redis: Redis
    isAgent?: boolean
    agentCommander: AgentCommander
    logger: pino.Logger
    environment: Environment
    posthog: ReturnType<typeof createPosthogClient>
    credentialsManager: CredentialsManager
    seraphCore: SeraphCore
    prisma: typeof prismaCore
    keyv: Keyv
  }
}

export async function initApp(environment: Environment = 'default') {
  const logger = getLogger()
  logger.info('Initializing feathers app...')
  app.set('logger', logger)

  const credentialsManager = new CredentialsManager()
  app.set('credentialsManager', credentialsManager)

  const prompt = 'You are seraph, a helpful AI angel.'

  if (process.env['ENABLE_SERAPH']) {
    logger.info('INITIALIZING SERAPH')
    const seraph = new SeraphCore({
      prompt,
      openAIApiKey: process.env['OPENAI_API_KEY'] as string,
      anthropicApiKey: process.env['ANTHROPIC_API_KEY'] as string,
    })
    app.set('seraphCore', seraph)
  }

  // seraph.registerMiddleware(new MemoryStorageMiddleware(seraph))
  // seraph.registerCognitiveFunction(new MemoryStorage(seraph))
  // seraph.registerCognitiveFunction(new MemoryRetrieval(seraph))

  if (process.env['POSTHOG_API_KEY']) {
    logger.info('INITIALIZING POSTHOG')
    app.set('posthog', createPosthogClient(app))
  }

  const port = parseInt(process.env.PORT || '3030', 10)
  app.set('port', port)

  const host = process.env.HOST || 'localhost'
  app.set('host', host)

  const paginateDefault = parseInt(PAGINATE_DEFAULT || '10', 10)
  const paginateMax = parseInt(PAGINATE_MAX || '50', 10)
  const paginate = {
    default: paginateDefault,
    max: paginateMax,
  }

  app.set('paginate', paginate)
  app.set('environment', environment)

  // Koa middleware
  app.use(cors({ origin: '*' }))
  app.use(errorHandler())
  app.use(parseAuthentication())
  app.use(
    bodyParser({ jsonLimit: '200mb', formLimit: '256mb', multipart: true })
  )

  // set up global keyv
  const keyv = new Keyv(DATABASE_URL, {
    schema: 'keyv',
  })

  app.set('keyv', keyv)

  // sync up messages between the app and the runner
  logger.info('SETTING UP REDIS')
  app.configure(
    feathersSync({
      uri: REDIS_URL as string,
      serialize: stringify,
      deserialize: JSON.parse,
    })
  )

  app.set('prisma', prismaCore)

  // Initialize pubsub redis client
  const pubsub = new RedisPubSub(REDIS_URL as string)
  await pubsub.initialize()

  app.set('pubsub', pubsub)

  const redis = new Redis(REDIS_URL as string, {
    maxRetriesPerRequest: null,
  })
  app.set('redis', redis)

  // Configure authentication
  app.set('authentication', {
    secret: process.env.JWT_SECRET || 'secret',
    entity: null,
    authStrategies: ['jwt'],
    jwtOptions: {
      header: { type: 'access' },
      audience: 'https://yourdomain.com', //TODO: should this be magickml.com?
      issuer: 'feathers',
      algorithm: 'A256GCM',
      expiresIn: '1d',
    },
  })

  app.configure(authentication)

  // Configure WebSocket for the app
  app.configure(
    socketio(
      {
        cors: {
          origin: '*',
          methods: ['GET', 'POST', 'OPTIONS'],
          allowedHeaders: ['Authorization'],
        },
        transports: ['websocket'],
      },
      handleSockets(app)
    )
  )

  // Configure services and transports
  app.configure(rest())

  app.configure(dbClient)
  app.configure(services)
  app.configure(channels)

  // Register hooks
  app.hooks({
    around: {
      all: [
        logError,
        authenticateApiKey([API_ACCESS_KEY]),
        async (context: HookContext, next) => {
          // if the route is to the api service, skip auth
          if (context.path === 'api') {
            context.params.user = {
              id: 'api',
              permissions: ['admin', 'owner'],
            }
            return next()
          }
          if (context.path.startsWith('health')) {
            context.params.user = {
              id: 'api',
              permissions: ['admin', 'owner'],
            }
            return next()
          }
          // if the route to /webhook/:agentid/:plugin, skip auth
          if (context.path.startsWith('webhook')) {
            // add mock permissions for now
            context.params.user = {
              id: 'api',
              permissions: ['admin', 'owner'],
            }
            return next()
          }
          // if we are authenticated with the API key, skip auth
          if (context.params.authenticated && context.params.apiKey) {
            // set the user to the api user for all permissions here
            context.params.user = {
              id: 'api',
              permissions: ['admin', 'owner'],
            }
            return next()
          }
          const socket = context.params.connection
          // if we are on a socket and there is a user, skip auth
          if (socket && socket.user) {
            context.params.user = socket.user
            return next()
          }
          if (context.path !== 'authentication') {
            return authenticate('jwt')(context, next)
          }
        },
        async (context: HookContext, next) => {
          const { params } = context
          // if we are authenticated with the API key, skip auth for full access
          if (context.params.authenticated && context.params.apiKey) {
            return next()
          }
          const { authentication, authenticated } = params
          if (authenticated) {
            context.params.user = authentication.payload.user
            context.params.projectId = authentication.payload.project
            const queryProjectId = context.params.query.projectId
            const bodyProjectId = context.params.body?.projectId
            if (!queryProjectId && !bodyProjectId) {
              console.error('No project id provided.')
              throw new NotAuthenticated('No project id provided.')
            }
            const providedProjectId = queryProjectId || bodyProjectId
            if (authentication.payload.project !== providedProjectId) {
              console.error(
                'User not authorized to access project',
                authentication.payload.project,
                providedProjectId
              )
              throw new NotAuthenticated(
                'User not authorized to access project'
              )
            }
          }
          return next()
        },
      ],
    },
    before: {
      all: [
        checkPermissions({
          roles: ['admin', 'owner', 'public'],
        }),
      ],
    },
    after: {},
    error: {},
  })

  // Register setup and teardown hooks
  app.hooks({
    setup: [],
    teardown: [],
  })
  logger.info('Feathers app initialized')

  return app
}

type BaseUser = {
  id: string
}

declare module '@feathersjs/feathers' {
  interface Params {
    user?: BaseUser & Record<any, any>
    projectId?: string
  }
}
