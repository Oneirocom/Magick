// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import type { Application } from './declarations'
import { logError } from './hooks'
import { dbClient } from './dbClient'
import { services } from './services'
import channels from './channels'
// import swagger from 'feathers-swagger'
import handleSockets from './sockets'
import { configureManager, globalsManager } from '@magickml/engine'

const app: Application = koa(feathers())

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
  max: paginateMax
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

// Configure services and transports
app.configure(rest())

// configures this needed for the spellManager
app.configure(configureManager())
app.configure(
  socketio(
    {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization'],
        credentials: true
      }
    },
    handleSockets(app)
  )
)
app.configure(dbClient)
app.configure(services)
app.configure(channels)

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

export { app }
