import {
  CloudAgentManagerV2,
  FeathersSyncReporter,
} from 'server/cloud-agent-manager'
import { initLogger, getLogger } from 'server/logger'
import { app, initApp } from 'server/core'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from 'shared/config'
import { BullQueue } from 'server/communication'
import { initAgentCommander } from '@magickml/agent-commander'

initLogger({ name: 'cloud-agent-manager' })
const logger = getLogger()

function start() {
  logger.info('Starting cloud agent manager...')
  const manager = new CloudAgentManagerV2({
    newQueue: new BullQueue(app.get('redis')),
    agentStateReporter: new FeathersSyncReporter(),
    pubSub: app.get('pubsub'),
  })

  manager.start()
  logger.info('Cloud agent manager started')
}

if (PRODUCTION || DONT_CRASH_ON_ERROR) {
  process.on('uncaughtException', (e: any) => {
    logger.error(e.stack, 'Uncaught exception: %s\n From: %o', e)
  })

  process.on('unhandledRejection', (e: any) => {
    logger.error(e.stack, 'Unhandled rejection: %s\n From: %o', e)
  })
}

logger.info('Initializing app...')
await initApp()

logger.info('Initializing agent commander...')
await initAgentCommander(app)

logger.info('Initializing cloud agent manager...')
start()
