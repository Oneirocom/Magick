import 'regenerator-runtime/runtime'

import { app } from './app'

import cors from '@koa/cors'
import Router from '@koa/router'
import {
  initFileServer,
  initTextToSpeech,
  initWeaviateClient,
} from '@magickml/server-core'
import {
  WEAVIATE_IMPORT_DATA,
  USESSL,
} from '@magickml/server-core'
import {
  Plugin  
} from '@magickml/magick-plugins'
import * as fs from 'fs'
import http from 'http'
import https from 'https'
import Koa from 'koa'
import koaBody from 'koa-body'
import compose from 'koa-compose'
import path from 'path'
import { initSpeechServer } from '@magickml/server-core'

import { Handler, Method, Middleware } from './types'


// log node.js errors
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err)
})

// log node.js errors
process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', err)
})

// todo probaly want to get ride of this.  Not super secure.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { logger } from './logger'

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

const router: Router = new Router()

import { apis } from './apis'
import { spells } from './spells'
import { Route } from './types'

const routes: Route[] = [...spells, ...apis]

import { worldManager } from '@magickml/engine'
import { World } from './World'
import { pluginsContext } from './plugins/discordPlugin'

async function init() {
  new World()
  new worldManager()
  initSpeechServer(false)
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
    } catch (error: any) {
      // where did the error come from?
      console.error(error)

      ctx.status = error.statusCode ;
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
  let plugin = {
    featherApp: app,
  }
  const discordInputPlugin = new Plugin(pluginsContext, app)
  discordInputPlugin.setup()
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

  app.listen(app.get('port'), () => {
    console.log('Server started on port ', app.get('port'))
  })

  // const useSSL =
  //   USESSL === 'true' &&
  //   fs.existsSync(path.join(__dirname, './certs/')) &&
  //   fs.existsSync(path.join(__dirname, './certs/key.pem')) &&
  //   fs.existsSync(path.join(__dirname, './certs/cert.pem'))

  // var optionSsl = {
  //   key: useSSL ? fs.readFileSync(path.join(__dirname, './certs/key.pem')) : '',
  //   cert: useSSL
  //     ? fs.readFileSync(path.join(__dirname, './certs/cert.pem'))
  //     : '',
  // }
  // useSSL
  //   ? https
  //       .createServer(optionSsl, app.callback())
  //       .listen(app.get('port'), 'localhost', () => {
  //         logger.info('Https Server listening on: localhost:' + app.get('port'))
  //       })
  //   : http.createServer(app.callback()).listen(app.get('port'), 'localhost', () => {
  //       logger.info('Http Server listening on: localhost:' + app.get('port'))
  //     })
  // await initLoop()
}

init()
