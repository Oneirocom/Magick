import { CloudAgentWorker } from '@magickml/cloud-agent-worker'
import { initLogger, getLogger } from '@magickml/core'
import { initApp } from '@magickml/server-core'

initLogger({ name: 'cloud-agent-worker' })
const logger = getLogger()

await initApp()

logger.info('Starting worker')
const worker = new CloudAgentWorker()
worker.work()
