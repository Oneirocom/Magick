import { CloudAgentWorker } from 'server/cloud-agent-worker'
import { initLogger, getLogger } from 'server/logger'
import { initApp } from 'server/core'
import { initAgentCommander } from 'server/agents'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from 'shared/config'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'

const PINO_LOG_LEVEL =
  (typeof process !== 'undefined' && process.env['PINO_LOG_LEVEL']) || 'info'

if (PRODUCTION) {
  initLogger({
    name: 'cloud-agent-worker',
    transport: {
      targets: [
        getPinoTransport(PINO_LOG_LEVEL),
        {
          target: 'pino-pretty',
          level: PINO_LOG_LEVEL,
          options: {
            colorize: true,
          },
        },
      ],
    },
    level: PINO_LOG_LEVEL,
  })
} else {
  initLogger({ name: 'cloud-agent-worker' })
}

console.log('GETTING LOGGER')
const logger = getLogger()

console.log('INIT APP')
const app = await initApp()

console.log('INIT AGENT COMMANDER')
await initAgentCommander()

if (PRODUCTION || DONT_CRASH_ON_ERROR) {
  process.on('uncaughtException', (e: any) => {
    logger.error(e, 'Uncaught exception: %s\n From: %o', e)
  })

  process.on('unhandledRejection', (e: any) => {
    logger.error(e, 'Unhandled rejection: %s\n From: %o', e)
  })
}

logger.info('Starting worker')
const worker = new CloudAgentWorker(app)
worker.startWork()
