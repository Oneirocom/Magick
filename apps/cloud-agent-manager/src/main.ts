import {
  CloudAgentManager,
  FeathersSyncReporter,
} from 'server/cloud-agent-manager'
import { initLogger, getLogger } from '@magickml/core'
import { app, BullQueue, initApp } from '@magickml/server-core'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from 'shared/config'
import { initAgentCommander } from 'server/agents'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'

if (PRODUCTION) {
  initLogger({
    name: 'cloud-agent-manager',
    transport: {
      targets: [getPinoTransport('info')],
    },
    level: 'info',
  })
} else {
  initLogger({ name: 'cloud-agent-manager' })
}
const logger = getLogger()

function start() {
  logger.info('Starting cloud agent manager...')
  const manager = new CloudAgentManager({
    newQueue: new BullQueue(),
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

await initApp()
await initAgentCommander()
start()
