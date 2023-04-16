// DOCUMENTED
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
  rest
} from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import {
  configureManager,
  DEFAULT_PROJECT_ID,
  DEFAULT_USER_ID,
  globalsManager,
  IGNORE_AUTH
} from '@magickml/core'

import { dbClient } from './dbClient'
import type { Application } from './declarations'
import { logError } from './hooks'
import channels from './sockets/channels'
// import swagger from 'feathers-swagger'
import { authentication } from './auth/authentication'
import { services } from './services'
import handleSockets from './sockets/sockets'

//Vector DB Related Imports
import { HNSWLib } from './vectordb'
// Initialize the Feathers Koa app
const app: Application = koa(feathers())
declare module './declarations' {
  interface Configuration {
    vectordb: HNSWLib & any
    docdb: HNSWLib & any
  }
}


/*
const vectorStoreInfo: typeof VectorStoreInfo = {
  name: "DB for Magick Events",
  description: "Stores all the event along with their metadata",
  vectorStore: vectordb,
};
const toolkit = new VectorStoreToolkit(vectorStoreInfo, model);
const agent = createVectorStoreAgent(model, toolkit);
const input =
    "What is this data about?";
  console.log(`Executing: ${input}`);
  const result = await agent.call({ input });
  console.log(`Got output ${result.output}`);
  console.log(
    `Got intermediate steps ${JSON.stringify(
      result.intermediateSteps,
      null,
      2
    )}`
  );
 */
// Expose feathers app to other apps that might want to access feathers services directly
globalsManager.register('feathers', app)

const port = parseInt(process.env.PORT || '3030', 10)
app.set('port', port)
const host = process.env.HOST || 'localhost'
app.set('host', host)
const paginateDefault = parseInt(process.env.PAGINATE_DEFAULT || '10', 10)
const paginateMax = parseInt(process.env.PAGINATE_MAX || '50', 10)
const paginate = {
  default: paginateDefault,
  max: paginateMax,
}
app.set('paginate', paginate)

// Koa middleware
app.use(cors({ origin: '*' }))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

// Configure app management settings
app.configure(configureManager())

// Configure authentication
if (!IGNORE_AUTH) {
  app.set('authentication', {
    secret: process.env.JWT_SECRET || 'secret',
    entity: null,
    authStrategies: ['jwt'],
    jwtOptions: {
      header: { type: 'access' },
      audience: 'https://yourdomain.com',
      issuer: 'feathers',
      algorithm: 'A256GCM',
      expiresIn: '1d',
    },
  })

  app.configure(authentication)
}

// Configure WebSocket for the app
app.configure(
  socketio(
    {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Authorization'],
        credentials: true,
      },
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
      async (context: HookContext, next) => {
        if (IGNORE_AUTH) return await next()
        if (context.path !== 'authentication') {
          return authenticate('jwt')(context, next)
        }
      },
      async (context: HookContext, next) => {
        const { params } = context

        if (IGNORE_AUTH) {
          context.params.user = {
            id: DEFAULT_USER_ID,
          }
          context.params.projectId = DEFAULT_PROJECT_ID
          return next()
        }

        const { authentication, authenticated } = params

        if (authenticated) {
          context.params.user = authentication.payload.user
          context.params.projectId = authentication.payload.projectId

          if (context?.params?.query?.projectId) {
            const projectId = context.params.query.projectId

            if (authentication.payload.project !== projectId) {
              console.log('User not authorized to access project')
              throw new NotAuthenticated(
                'User not authorized to access project'
              )
            }
          }
        }

        return next()
      },
    ],
  },
  before: {
    all: [],
  },
  after: {},
  error: {},
})

// Register setup and teardown hooks
app.hooks({
  setup: [],
  teardown: [],
})

// Export the app
export { app }
