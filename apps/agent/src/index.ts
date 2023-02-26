import 'regenerator-runtime/runtime'

import { worldManager, pluginManager } from '@magickml/engine'
import { agentManager } from '@magickml/server-core'
async function init() {
  // load plugins
  await (async () => {
    let plugins = (await import('./plugins')).default
    console.log('loaded plugins on server', plugins)
  })()
  console.log('AGENT: Starting agent manager', agentManager.agents)
  console.log('AGENT: Starting world manager', worldManager.rooms)
  console.log('AGENT: Loading plugins', pluginManager.plugins.map((p) => p.name).join(', '))
}

init()