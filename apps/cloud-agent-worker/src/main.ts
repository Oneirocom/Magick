import { CloudAgentWorker } from 'server/cloud-agent-worker'
import { initLogger, getLogger } from '@magickml/server-logger'
import { initApp } from '@magickml/agent-server'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from '@magickml/server-config'
import { initAgentCommander } from '@magickml/agent-commander'

initLogger({ name: 'cloud-agent-worker' })

console.log('GETTING LOGGER')
const logger = getLogger()

console.log('INIT APP')
const app = await initApp()

console.log('INIT AGENT COMMANDER')
await initAgentCommander(app)

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
