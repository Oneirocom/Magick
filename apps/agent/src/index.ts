import 'regenerator-runtime/runtime'

import { WorldManager, pluginManager } from '@magickml/engine'
import { AgentManager } from '@magickml/server-core'
async function init() {
  // load plugins
  await (async () => {
    let plugins = (await import('./plugins')).default
    console.log('loaded plugins on server', Object.values(plugins).map((p: any) => p.name).join(', '));
  })()
  const agentManager = new AgentManager()
  const worldManager = new WorldManager()
  console.log('AGENT: Starting agent manager', agentManager)
  console.log('AGENT: Starting world manager', worldManager.rooms)
}

init()