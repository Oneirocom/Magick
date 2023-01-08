import { config } from 'dotenv-flow'
config({
  path: '../../../',
})
import cors from '@koa/cors'
import Router from '@koa/router'
import HttpStatus from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import compose from 'koa-compose'
import { database } from '@magickml/database'
import { routes } from './routes'
import { Handler, Method, Middleware } from './types'
import {
  initTextToSpeech,
  initFileServer,
  initWeaviateClient,
} from '@magickml/systems'
import https from 'https'
import http from 'http'
import * as fs from 'fs'
import path from 'path'

const app: Koa = new Koa()
const router: Router = new Router()
// @ts-ignore
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

async function init() {
  // required for some current consumers (i.e magick)
  // to-do: standardize an allowed origin list based on env values or another source of truth?

  new database()
  await database.instance.connect()
  console.log(
    'refreshing db',
    process.env.REFRESH_DB?.toLowerCase().trim() === 'true'
  )
  await database.instance.sequelize.sync({
    force: process.env.REFRESH_DB?.toLowerCase().trim() === 'true',
  })
  await initFileServer()
  await initTextToSpeech()
  await initWeaviateClient(
    process.env.WEAVIATE_IMPORT_DATA?.toLowerCase().trim() === 'true',
    process.env.CLASSIFIER_IMPORT_DATA?.toLowerCase().trim() === 'true'
  )
  database.instance.close()

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

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:' + err + ' - ' + err.stack)
  })

  // Middleware used by every request. For route-specific middleware, add it to you route middleware specification
  app.use(koaBody({ multipart: true }))

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
    middleware: Middleware[] | undefined
  }

  const routeMiddleware = ({ middleware = [] }: MiddlewareParams) => {
    return [...middleware]
  }

  // Create Koa routes from the routes defined in each module
  routes.forEach(route => {
    const { method, path, middleware, handler } = route
    const _middleware = routeMiddleware({ middleware })
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
    fs.existsSync(path.join(__dirname, './certs/')) &&
    fs.existsSync(path.join(__dirname, './certs/key.pem')) &&
    fs.existsSync(path.join(__dirname, './certs/cert.pem'))

  var optionSsl = {
    key: useSSL ? fs.readFileSync(path.join(__dirname, './certs/key.pem')) : '',
    cert: useSSL
      ? fs.readFileSync(path.join(__dirname, './certs/cert.pem'))
      : '',
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
