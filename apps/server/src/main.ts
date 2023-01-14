import {
  WEAVIATE_IMPORT_DATA,
  USESSL,
} from './../../../packages/server-config/src/index'
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
import { SERVER_PORT } from '@magickml/server-config'

const app: Koa = new Koa()
const router: Router = new Router()

// todo probaly want to get ride of this.  Not super secure.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

async function init() {
  new database()

  await initFileServer()
  await initTextToSpeech()
  await initWeaviateClient(
    typeof WEAVIATE_IMPORT_DATA === 'string'
      ? WEAVIATE_IMPORT_DATA?.toLowerCase().trim() === 'true'
      : WEAVIATE_IMPORT_DATA
  )

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

  const PORT: number = Number(SERVER_PORT) || 8001
  const useSSL =
    USESSL === 'true' &&
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
        .listen(PORT, 'localhost', () => {
          console.log('Https Server listening on: localhost:' + PORT)
        })
    : http.createServer(app.callback()).listen(PORT, 'localhost', () => {
        console.log('Http Server listening on: localhost:' + PORT)
      })
  // await initLoop()
}

init()
