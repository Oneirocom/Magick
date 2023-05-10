// DOCUMENTED
/**
 * Entry point of MagickML server. Initializes the necessary modules, middleware and routes to start up the server.
 **/

import cors from '@koa/cors'
import Router from '@koa/router'
import { pluginManager } from '@magickml/core'
import {
  apis,
  app,
  Handler,
  initFileServer,
  Method,
  Middleware,
  Route,
  spells
} from '@magickml/server-core'
import { Context } from 'koa'
import koaBody from 'koa-body'
import compose from 'koa-compose'
import 'regenerator-runtime/runtime.js'

// log handle errors
process.on('uncaughtException', (err: Error) => {
  console.error('uncaughtException', err)
})

process.on(
  'unhandledRejection',
  (
    reason: {
      /* null */
    },
    p: Promise<any>
  ) => console.error('Unhandled Rejection at: Promise ', p, reason)
)

// initialize server routes from the plugin manager
const serverRoutes: Route[] = pluginManager.getServerRoutes()
const router: Router = new Router()

// merge spells, apis and server routes
const routes: Route[] = [...spells, ...apis, ...serverRoutes]

/**
 * Initializes the server, sets up error-handling middleware, cross-origin resource sharing,
 * form and multipart-json requests, and routes.
 */
async function init() {
  // load plugins
  await (async () => {
    const plugins = (await import('./plugins')).default
    console.log(
      'loaded plugins on server',
      Object.values(plugins)
        .map((p: any) => p.name)
        .join(', ')
    )
  })()

  // initSpeechServer()
  await initFileServer()
  // await initTextToSpeech()

  const serverInits: Record<string, any> = pluginManager.getServerInits()

  for (const method of Object.keys(serverInits)) {
    await serverInits[method]()
  }

  // generic error handling for any errors that may occur
  app.use(async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next()
    } catch (error: any) {
      ctx.status = error.statusCode
      ctx.body = { error }
      ctx.app.emit('error', error, ctx)
    }
  })

  const options = { origin: '*' }
  app.use(cors(options))

  process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:' + err + ' - ' + err.stack)
  })

  // Middleware used by every request. For route-specific middleware, add it to you route middleware specification
  app.use(koaBody({ multipart: true }))

  /**
   * Creates a Koa route from the Route object passed in.
   * @param method The HTTP method used for the route
   * @param path The path of the route
   * @param middleware Array of middleware functions to be passed to the route.
   * @param handler The function to handle the request for the route.
   */
  const createRoute = (method: Method, path: string, middleware: Middleware[], handler: Handler) => {
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

  /**
   * Returns an array of middleware functions. If none are passed, it returns an empty array.
   * @param middleware An optional array of middleware functions to be included in the returned array.
   * return An array of middleware functions to be used with a route.
   */
  const routeMiddleware = ({ middleware = [] }: { middleware?: Middleware[] } = {}) => {
    return [...middleware]
  }

  // Create Koa routes from the routes defined in each module
  routes.forEach((route) => {
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

  process.on('uncaughtException in Editor Server', console.error)

  // adding router middlewares to Koa app
  app.use(router.routes()).use(router.allowedMethods())

  app.listen(app.get('port'), () => {
    console.log('Server started on port ', app.get('port'))
  })
}

init()
