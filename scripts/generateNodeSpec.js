const dotenv = require('dotenv-flow')
dotenv.config('../')

const fs = require('fs')
const path = require('path')
const pluginModules = require('../plugins')
const { writeNodeSpecsToJSON } = require('@magickml/behave-graph')
const Redis = require('ioredis')
const { RedisPubSub } = require('server/redis-pubsub')
const { REDISCLOUD_URL } = require('shared/config')

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

const loadPlugins = async () => {
  const connection = new Redis()
  const pubSub = new RedisPubSub()

  await pubSub.initialize(REDISCLOUD_URL)

  const plugins = []
  for (const [pluginName, pluginGetter] of Object.entries(pluginModules)) {
    // Get the actual class from the getter
    const PluginClass = pluginGetter

    // Check if PluginClass is a subclass of CorePlugin
    if (checkIfCorePlugin(PluginClass)) {
      // Create an instance of the plugin
      const pluginInstance = new PluginClass(connection, '000000000', pubSub)
      plugins.push(pluginInstance)
    }
  }
  return plugins
}

async function writeNodeSpecsToFile(fileLocation) {
  // Get the registry from all plugins
  const plugins = await loadPlugins()

  const registry = getUnifiedRegistry(plugins)

  // Write the registry to JSON
  const nodeSpecsJson = writeNodeSpecsToJSON(registry)

  console.log('WRITING NODE SPECS')

  // Write the JSON to file
  fs.writeFileSync(
    path.join(fileLocation),
    JSON.stringify(nodeSpecsJson, null, 2)
  )

  console.log('DONE WRITING NODE SPECS')
}

writeNodeSpecsToFile(
  path.resolve('./packages/shared/nodeSpec/src/nodeSpec.json')
)

module.exports = {
  writeNodeSpecsToFile,
}
