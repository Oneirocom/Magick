import { DEFAULT_PROJECT_ID, DEFAULT_USER_ID } from '@magickml/engine'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import {
  koa,
  rest,
  bodyParser,
  errorHandler,
  parseAuthentication,
  cors,
} from '@feathersjs/koa'
import { authenticate } from '@feathersjs/authentication/lib/hooks'
import socketio from '@feathersjs/socketio'
import type { Application, HookContext } from './declarations'
import { logError } from './hooks'
import { dbClient } from './dbClient'
import channels from './sockets/channels'
// import swagger from 'feathers-swagger'
import handleSockets from './sockets/sockets'
import { configureManager, globalsManager, IGNORE_AUTH } from '@magickml/engine'
import { services } from './services'
import { authentication } from './auth/authentication'
import { NotAuthenticated } from '@feathersjs/errors/lib'
import { apis } from './api/apis'

const app: Application = koa(feathers())
import HNSWVectorDatabase from './vectordb'

// Define a distance function for the vectors
function euclideanDistance(a: number[], b: number[]): number {
  let distance = 0
  for (let i = 0; i < a.length; i++) {
    distance += (a[i] - b[i]) ** 2
  }
  return Math.sqrt(distance)
}

const vectordb = new HNSWVectorDatabase<number[]>(
  'data.json',
  euclideanDistance
)

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

// app.configure(
//   swagger({
//     ui: swagger.swaggerUI({}),
//     specs: {
//       info: {
//         title: 'Magick API Documentation',
//         description: 'Documentation for the Magick API backend, built with FeathersJS',
//         version: '1.0.0'
//       }
//     }
//   })
// )

// Set up Koa middleware
app.use(cors())
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

app.configure(configureManager())

if (!IGNORE_AUTH) {
  // this will configure out stateless JWT authentication
  app.set('authentication', {
    // We will want to use the same secret as the cloud is using for shared authentication
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
// app.use(authenticate('jwt'))

// Configure services and transports
app.configure(rest())

// configures this needed for the spellManager
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
declare module './declarations' {
  interface Configuration {
    vectordb: HNSWVectorDatabase<number[]>
  }
}

app.set('vectordb', vectordb)
app.configure(dbClient)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [
      logError,
      async (context, next) => {
        if (IGNORE_AUTH) return await next()
        if (context.path !== 'authentication') {
          return authenticate('jwt')(context, next)
        }

        await next()
      },
      // attach the user from the payload to the params
      async (context: HookContext, next) => {
        const { params } = context

        if (IGNORE_AUTH) {
          context.params.user = {
            id: DEFAULT_USER_ID,
          }
          context.params.projectId = DEFAULT_PROJECT_ID
          return await next()
        }

        const { authentication, authenticated } = params

        // First check if this is authenticated
        if (authenticated) {
          context.params.user = authentication.payload.user
          context.params.projectId = authentication.payload.projectId

          // Now we check to see if the query has a project id on it.
          // If it does, we check to see if the user is authorized to access that project
          if (context?.params?.query?.projectId) {
            const projectId = context.params.query.projectId

            // todo we should change this in payload from project to projectId
            if (authentication.payload.project !== projectId) {
              console.log('User not authorized to access project')
              throw new NotAuthenticated(
                'User not authorized to access project'
              )
            }
          }
        }

        await next()
      },
      // authorize user to access project from query params
    ],
  },
  before: {
    all: [],
  },
  after: {},
  error: {},
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: [],
})

export { app }
