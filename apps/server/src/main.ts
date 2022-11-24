import { config } from 'dotenv-flow'
config()
//@ts-ignore
import cors from '@koa/cors'
import Router from '@koa/router'
import { initClassifier } from '@thothai/core/dist/server'
import HttpStatus from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import compose from 'koa-compose'
import { cacheManager } from './cacheManager'
import { database } from './database'
import { creatorToolsDatabase } from './databases/creatorTools'
import { routes } from './routes'
import { Handler, Method, Middleware } from './types'
import { initTextToSpeech } from './systems/googleTextToSpeech'
import { initFileServer } from './systems/fileServer'
import https from 'https'
import http from 'http'
import * as fs from 'fs'
import spawnPythonServer from './systems/pythonServer'
import { auth } from './middleware/auth'
import { initWeaviateClient } from './systems/weaviateClient'
import cors_server from './cors-server'
import { initExitHandler } from './exitHandler'

const app: Koa = new Koa()
const router: Router = new Router()
// @ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

async function init() {
  initExitHandler()
  // async function initLoop() {
  //   new roomManager()
  //   const expectedServerDelta = 1000 / 60
  //   let lastTime = 0

  //   // @ts-ignore
  //   globalThis.requestAnimationFrame = f => {
  //     const serverLoop = () => {
  //       const now = Date.now()
  //       if (now - lastTime >= expectedServerDelta) {
  //         lastTime = now
  //         f(now)
  //       } else {
  //         setImmediate(serverLoop)
  //       }
  //     }
  //     serverLoop()
  //   }
  // }

  // required for some current consumers (i.e Thoth)
  // to-do: standardize an allowed origin list based on env values or another source of truth?

  new database()
  await database.instance.connect()
  console.log(
    'refreshing db',
    process.env.REFRESH_DB?.toLowerCase().trim() === 'true'
  )
  await creatorToolsDatabase.sequelize.sync({
    force: process.env.REFRESH_DB?.toLowerCase().trim() === 'true',
  })
  await database.instance.firstInit()

  // todo better organize and architect these servers and determine what is needed.
  // await initFileServer()
  // await initClassifier()
  // await initTextToSpeech()
  // new cacheManager()
  // await initWeaviateClient(
  //   process.env.WEAVIATE_IMPORT_DATA?.toLowerCase().trim() === 'true',
  //   process.env.CLASSIFIER_IMPORT_DATA?.toLowerCase().trim() === 'true'
  // )

  // if (process.env.RUN_PYTHON_SERVER === 'true') {
  //   spawnPythonServer()
  // }

  // generic error handling
  app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error) {
      ctx.status =
        error.statusCode || error.status || HttpStatus.INTERNAL_SERVER_ERROR
      error.status = ctx.status
      ctx.body = { error }
      ctx.app.emit('error', error, ctx)
    }
  })

  const options = {
    origin: '*',
  }
  app.use(cors(options))

  new cors_server(
    parseInt(process.env.CORS_PORT as string),
    '0.0.0.0',
    process.env.USESSL === 'true' &&
      fs.existsSync('certs/') &&
      fs.existsSync('certs/key.pem') &&
      fs.existsSync('certs/cert.pem')
  )

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:' + err + ' - ' + err.stack)
  })

  // Middleware used by every request. For route-specific middleware, add it to you route middleware specification
  app.use(koaBody({ multipart: true }))

  // Middleware used to handle authentication
  app.use(auth.isValidToken)

  const createRoute = (
    method: Method,
    path: string,
    middleware: Middleware[],
    handler: Handler
  ) => {
    // This gets a typescript error
    // router[method](path, compose(_middleware), handler);
    // TODO: Fix this hack:
    switch (method) {
      case 'get':
        router.get(path, compose(middleware), handler)
        break
      case 'post':
        router.post(path, compose(middleware), handler)
        break
      case 'put':
        router.put(path, compose(middleware), handler)
        break
      case 'delete':
        router.delete(path, compose(middleware), handler)
        break
      case 'head':
        router.head(path, compose(middleware), handler)
        break
      case 'patch':
        router.patch(path, compose(middleware), handler)
        break
    }
  }

  type MiddlewareParams = {
    access: string | string[] | Middleware
    middleware: Middleware[] | undefined
  }

  const routeMiddleware = ({ access, middleware = [] }: MiddlewareParams) => {
    if (!access) return [...middleware]
    if (typeof access === 'function') return [access, ...middleware]
    if (typeof access === 'string') return [...middleware]
    return [...middleware]
  }

  // Create Koa routes from the routes defined in each module
  routes.forEach(route => {
    const { method, path, access, middleware, handler } = route
    const _middleware = routeMiddleware({ access, middleware })
    if (method && handler) {
      createRoute(method, path, _middleware, handler)
    }
    if (route.get) {
      createRoute('get', path, _middleware, route.get)
    }
    if (route.put) {
      createRoute('put', path, _middleware, route.put)
    }
    if (route.post) {
      createRoute('post', path, _middleware, route.post)
    }
    if (route.delete) {
      createRoute('delete', path, _middleware, route.delete)
    }
    if (route.head) {
      createRoute('head', path, _middleware, route.head)
    }
    if (route.patch) {
      createRoute('patch', path, _middleware, route.patch)
    }
  })

  app.use(router.routes()).use(router.allowedMethods())

  const PORT: number = Number(process.env.PORT) || 8001
  const useSSL =
    process.env.USESSL === 'true' &&
    fs.existsSync('certs/') &&
    fs.existsSync('certs/key.pem') &&
    fs.existsSync('certs/cert.pem')

  var optionSsl = {
    key: useSSL ? fs.readFileSync('certs/key.pem') : '',
    cert: useSSL ? fs.readFileSync('certs/cert.pem') : '',
  }
  useSSL
    ? https
        .createServer(optionSsl, app.callback())
        .listen(PORT, '0.0.0.0', () => {
          console.log('Https Server listening on: 0.0.0.0:' + PORT)
        })
    : http.createServer(app.callback()).listen(PORT, '0.0.0.0', () => {
        console.log('Http Server listening on: 0.0.0.0:' + PORT)
      })
  // await initLoop()
}

init()
