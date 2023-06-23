import { CloudAgentWorker } from '@magickml/cloud-agent-worker'
import { initLogger, getLogger } from '@magickml/core'
import { initApp } from '@magickml/server-core'
import pluginExports from './plugins'

initLogger({ name: 'cloud-agent-worker' })
const logger = getLogger()

await initApp()

async function loadPlugins(): Promise<void> {
  logger.info('Loading plugins...')
  // Log the loaded plugin names.
  const pluginNames = Object.values(pluginExports)
    .map((p: any) => p.name)
    .join(', ')
  logger.info('Plugins loaded: %o', pluginNames)
}

await loadPlugins()

logger.info('Starting worker')
const worker = new CloudAgentWorker()
worker.work()
