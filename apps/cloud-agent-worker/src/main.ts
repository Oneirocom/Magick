import { CloudAgentWorker } from '@magickml/cloud-agent-worker'
import { initLogger, getLogger } from '@magickml/core'
import { initApp } from '@magickml/server-core'
import pluginExports from './plugins'
import { initAgentCommander } from '@magickml/agents'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from "@magickml/config"

initLogger({ name: 'cloud-agent-worker' })
const logger = getLogger()

await initApp()

await initAgentCommander()

async function loadPlugins(): Promise<void> {
  logger.info('Loading plugins...')
  // Log the loaded plugin names.
  const pluginNames = Object.values(pluginExports)
    .map((p: any) => p.name)
    .join(', ')
  logger.info('Plugins loaded: %o', pluginNames)
}

if (PRODUCTION || DONT_CRASH_ON_ERROR) {
  process.on('uncaughtException', (e, o) => {
    logger.error('Uncaught exception: %s\n From: %o', e, o)
  })

  process.on('unhandledRejection', (e, o) => {
    logger.error('Unhandled rejection: %s\n From: %o', e, o)
  })
}

await loadPlugins()

logger.info('Starting worker')
const worker = new CloudAgentWorker()
worker.work()
