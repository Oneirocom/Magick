// DOCUMENTED
import {
  authenticate,
  bodyParser,
  cors,
  errorHandler,
  koa,
  parseAuthentication,
  rest,
} from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'
import { dbClient } from './dbClient'
import type { Application, HookContext } from './declarations'
import { logError } from './hooks'
import channels from './sockets/channels'
// import swagger from 'feathers-swagger'
import { NotAuthenticated } from '@feathersjs/errors/lib'
import { authentication } from './auth/authentication'
import { services } from './services'
import handleSockets from './sockets/sockets'

//Vector DB Related Imports
import { import_ } from '@brillout/import'
import { feathers } from '@feathersjs/feathers/lib'
import {
  configureManager,
  DEFAULT_PROJECT_ID,
  DEFAULT_USER_ID,
  globalsManager,
  IGNORE_AUTH,
} from '@magickml/core'
import { createClient } from '@supabase/supabase-js'
import { HNSWLib, SupabaseVectorStoreCustom } from './vectordb'
// Same as `import()`

//Dynamic Import using top lvl await
const modules = import_('langchain/embeddings')
const { FakeEmbeddings } = await modules
const agentpro = import_('langchain/agents')
const { VectorStoreToolkit, createVectorStoreAgent, VectorStoreInfo } =
  await agentpro
const openaipro = import_('langchain')
const { OpenAI } = await openaipro
const embeddings = new FakeEmbeddings()

const { Headers, Request, Response } = await import_('node-fetch')
const fetch = await import_('node-fetch').then(mod => mod.default)

if (!globalThis.fetch) globalThis.fetch = fetch
if (!globalThis.Headers) globalThis.Headers = Headers
if (!globalThis.Request) globalThis.Request = Request
if (!globalThis.Response) globalThis.Response = Response

// Initialize the Feathers Koa app
const app: Application = koa(feathers())

app.use(
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Security-Policy'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
)

app.use(async (ctx, next) => {
  ctx.set('Content-Security-Policy', "frame-ancestors 'self' *")
  await next()
})

// app.use(async (ctx, next) => {
//   ctx.set('Content-Security-Policy', "frame-ancestors 'self' *")
//   ctx.set('Access-Control-Allow-Origin', '*')
//   ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
//   ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//   ctx.set('Access-Control-Allow-Credentials', 'true')
//   await next()
// })

declare module './declarations' {
  interface Configuration {
    vectordb: HNSWLib & any
    docdb: HNSWLib & any
  }
}
if (process.env.DATABASE_TYPE == 'sqlite') {
  console.log('Setting up vector store')
  const vectordb = HNSWLib.load_data('.', embeddings, {
    space: 'cosine',
    numDimensions: 1536,
    filename: 'database',
  })
  const docdb = HNSWLib.load_data('.', embeddings, {
    space: 'cosine',
    numDimensions: 1536,
    filename: 'documents',
  })
  app.set('vectordb', vectordb)
  app.set('docdb', docdb)
} else {
  const cli = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  const vectordb = new SupabaseVectorStoreCustom(embeddings, {
    client: cli,
    tableName: 'events',
    queryName: 'match_events',
  })
  const docdb = new SupabaseVectorStoreCustom(embeddings, {
    client: cli,
    tableName: 'documents',
    queryName: 'match_documents',
  })
  app.set('vectordb', vectordb)
  app.set('docdb', docdb)
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
// app.use(cors({ origin: '*' }))
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

// Configure services and transports
app.configure(rest())

// Configure WebSocket for the app
app.configure(
  socketio(
    {
      cors: {
        origin: (origin, callback) => {
          // For simplicity, allow any origin. You can also use a function or an array of origins.
          callback(null, true)
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      },
    },
    handleSockets(app)
  )
)

app.configure(dbClient)
app.configure(services)
app.configure(channels)

// Register hooks
app.hooks({
  around: {
    all: [
      logError,
      async (context, next) => {
        if (IGNORE_AUTH) return await next()
        if (context.path !== 'authentication') {
          return authenticate('jwt')(context as any, next)
        }

        await next()
      },
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

        await next()
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
