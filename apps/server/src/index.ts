// DOCUMENTED
/**
 * Entry point of MagickML server. Initializes the necessary modules, middleware and routes to start up the server.
 **/

import cors from '@koa/cors'
import { initApp, app } from 'server/core'
import { initLogger, getLogger } from 'server/logger'
import { Context } from 'koa'
import koaBody from 'koa-body'
import 'regenerator-runtime/runtime'
import { initAgentCommander } from 'server/agents'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'
import { PRODUCTION } from 'shared/config'

const PINO_LOG_LEVEL = (typeof process !== 'undefined' && process.env['PINO_LOG_LEVEL']) || 'info'

if (PRODUCTION) {
  initLogger({
    name: 'cloud-agent-worker',
    transport: {
      targets: [
        getPinoTransport('info'),
        {
          target: 'pino-pretty',
          level: PINO_LOG_LEVEL,
          options: {
            colorize: true
          }
        }
      ]
    },
    level: 'info'
  })
} else {
  initLogger({ name: 'cloud-agent-worker' })
}
const logger = getLogger()

// log handle errors
process.on('uncaughtException', (err: Error) => {
  logger.error(err, 'uncaughtException %s')
})

process.on(
  'unhandledRejection',
  (
    reason: {
      /* null */
    },
    p: Promise<any>
  ) => logger.error('Unhandled Rejection at: Promise %o with reason %s', p, reason)
)

/**
 * Initializes the server, sets up error-handling middleware, cross-origin resource sharing,
 * form and multipart-json requests, and routes.
 */
async function init() {
  await initApp('server')
  await initAgentCommander()

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
    logger.error('Unhandled Rejection:' + err + ' - ' + err.stack)
  })

  // Middleware used by every request. For route-specific middleware, add it to you route middleware specification
  app.use(koaBody({ multipart: true, jsonLimit: '200mb', formLimit: '200mb' }))

  app.listen(app.get('port'), () => {
    logger.info('Server started on port %s', app.get('port'))
  })
}

init()
