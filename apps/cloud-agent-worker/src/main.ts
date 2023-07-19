import { CloudAgentWorker } from '@magickml/cloud-agent-worker'
import { initLogger, getLogger } from '@magickml/core'
import { initApp, app } from '@magickml/server-core'
import pluginExports from './plugins'
import { REDISCLOUD_URL } from '@magickml/config'
import { initAgentCommander } from '@magickml/agents'

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

await loadPlugins()

logger.info('Starting worker')
const worker = new CloudAgentWorker()
worker.work()
