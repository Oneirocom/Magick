import 'regenerator-runtime/runtime'

import { app } from './app'

import cors from '@koa/cors'
import Router from '@koa/router'
import {
  initFileServer,
  initTextToSpeech,
} from '@magickml/server-core'
import Koa from 'koa'
import koaBody from 'koa-body'
import compose from 'koa-compose'
import { initSpeechServer } from '@magickml/server-core'

import { logger } from './logger'

import { apis } from './apis'
import { spells } from './spells'
import { Handler, Method, Middleware, Route } from '@magickml/server-core'
import { worldManager, pluginManager } from '@magickml/engine'
import { World } from './World'
import { HookContext, NextFunction } from '@feathersjs/feathers/lib'

// log node.js errors
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err)
})

// log node.js errors
process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection', err)
})

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
)

const serverRoutes = pluginManager.getServerRoutes();

const router: Router = new Router()

const routes: Route[] = [...spells, ...apis, ...serverRoutes]

async function init() {
  // load plugins
  await (async () => {
    let plugins = (await import('./plugins')).default
    console.log('loaded plugins on server', plugins)
  })()
  try{
    new World()
    console.log("CREATED WORLD")
    new worldManager()
  } catch(e){
    app.service('agents').hooks([
      async (context: HookContext) => {
        throw new Error(e)
      }
    ])
    console.log("ERROR CAUGHT: ",e)
  }
  
  
  initSpeechServer(false)
  await initFileServer()
  await initTextToSpeech()

  const serverInits = pluginManager.getServerInits();
  for (const method of Object.keys(serverInits)) {
    await serverInits[method]();
  }

  // generic error handling
  app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error: any) {
      ctx.status = error.statusCode;
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

  app.listen(app.get('port'), () => {
    console.log('Server started on port ', app.get('port'))
  })
}

init()