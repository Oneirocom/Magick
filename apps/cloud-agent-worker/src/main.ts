import { CloudAgentWorker } from 'server/cloud-agent-worker'
import { initLogger, getLogger } from 'shared/core'
import { initApp } from 'server/core'
import pluginExports from './plugins'
import { initAgentCommander } from 'server/agents'
import { DONT_CRASH_ON_ERROR, PRODUCTION } from 'shared/config'
import { getPinoTransport } from '@hyperdx/node-opentelemetry'

if (PRODUCTION) {
  initLogger({
    name: 'cloud-agent-worker',
    transport: {
      targets: [getPinoTransport('info')],
    },
    level: 'info',
  })
} else {
  initLogger({ name: 'cloud-agent-worker' })
}
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
  process.on('uncaughtException', (e: any) => {
    logger.error('Uncaught exception: %s\n From: %o', e, e.stack)
  })

  process.on('unhandledRejection', (e: any) => {
    logger.error('Unhandled rejection: %s\n From: %o', e, e.stack)
  })
}

await loadPlugins()

logger.info('Starting worker')
const worker = new CloudAgentWorker()
worker.startWork()
