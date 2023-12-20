// eslint-disable-next-line
const fs = require('fs')
// eslint-disable-next-line
const path = require('path')
import * as pluginModules from '../../../../../plugins'
import { writeNodeSpecsToJSON } from '@magickml/behave-graph'
import Redis from 'ioredis'
import { RedisPubSub } from 'server/redis-pubsub'

const checkIfCorePlugin = PluginClass => {
  return (
    typeof PluginClass.prototype.init === 'function' &&
    typeof PluginClass.prototype.getRegistry === 'function' &&
    typeof PluginClass.prototype.onMessage === 'function'
  )
}

const getUnifiedRegistry = plugins => {
  const unifiedRegistry = {
    nodes: {},
    values: {},
    dependencies: {},
  }

  for (const plugin of plugins) {
    const { nodes, values, dependencies } = plugin.getRegistry(unifiedRegistry)
    Object.assign(unifiedRegistry.nodes, nodes)
    Object.assign(unifiedRegistry.values, values)
    Object.assign(unifiedRegistry.dependencies, dependencies)
  }

  return unifiedRegistry
}

const loadPlugins = () => {
  const connection = new Redis()
  const pubSub = new RedisPubSub()

  const plugins = []
  for (const [, pluginGetter] of Object.entries(pluginModules)) {
    // Get the actual class from the getter
    const PluginClass = pluginGetter

    // Check if PluginClass extends CorePlugin
    // This check assumes CorePlugin is the base class for all your plugins
    if (checkIfCorePlugin(PluginClass)) {
      // PluginClass is a subclass of CorePlugin

      // Create an instance of the plugin
      const pluginInstance = new PluginClass(connection, '000000', pubSub)
      plugins.push(pluginInstance)
    }
    return plugins
  }
}

export function writeNodeSpecsToFile(fileLocation) {
  // get the registry from all plugins
  const registry = getUnifiedRegistry(loadPlugins())

  // write the registry to JSON
  const nodeSpecsJson = writeNodeSpecsToJSON(registry)

  // write the JSON to file
  fs.writeFileSync(
    path.join(fileLocation),
    JSON.stringify(nodeSpecsJson, null, 2)
  )
}
