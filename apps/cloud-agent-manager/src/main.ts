import {
  CloudAgentManager,
  FeathersSyncReporter,
} from 'server/cloud-agent-manager'
import { initLogger, getLogger } from 'server/logger'
import { app, initApp } from 'server/core'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from 'shared/config'
import { initAgentCommander } from 'server/agents'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'
import { BullQueue } from 'server/communication'

const PINO_LOG_LEVEL =
  (typeof process !== 'undefined' && process.env['PINO_LOG_LEVEL']) || 'info'

if (PRODUCTION) {
  initLogger({
    name: 'cloud-agent-manager',
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
  initLogger({ name: 'cloud-agent-manager' })
}
const logger = getLogger()

function start() {
  logger.info('Starting cloud agent manager...')
  const manager = new CloudAgentManager({
    newQueue: new BullQueue(app.get('redis')),
    agentStateReporter: new FeathersSyncReporter(),
    pubSub: app.get('pubsub'),
  })

  manager.run()
  logger.info('Cloud agent manager started')
}

if (PRODUCTION || DONT_CRASH_ON_ERROR) {
  process.on('uncaughtException', (e: any) => {
    logger.error('Uncaught exception: %s\n From: %o', e, e.stack)
  })

  process.on('unhandledRejection', (e: any) => {
    logger.error('Unhandled rejection: %s\n From: %o', e, e.stack)
  })
}
console.log('INIT APP')
await initApp()

console.log('INIT AGENT COMMANDER')
await initAgentCommander()

console.log('START')
start()
