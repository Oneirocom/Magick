/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv-flow')
dotenv.config('../')
const fs = require('fs')
const path = require('path')
import * as pluginModules from '../plugins'
import { writeNodeSpecsToJSON } from '@magickml/behave-graph'
import Redis from 'ioredis'
import { PluginCredential } from 'packages/server/credentials/src'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'

let plugins = []

const checkIfCorePlugin = PluginClass => {
  return (
    typeof PluginClass.prototype.init === 'function' &&
    typeof PluginClass.prototype.getRegistry === 'function'
  )
}

const getUnifiedRegistry = async plugins => {
  const unifiedRegistry = {
    nodes: {},
    values: {},
    dependencies: {},
  }

  for (const plugin of plugins) {
    const { nodes, values, dependencies } = await plugin.getRegistryForNodeSpec(
      unifiedRegistry
    )
    Object.assign(unifiedRegistry.nodes, nodes)
    Object.assign(unifiedRegistry.values, values)
    Object.assign(unifiedRegistry.dependencies, dependencies)
  }

  return unifiedRegistry
}

const loadPlugins = async () => {
  const connection = new Redis()
  const pubSub = new RedisPubSub()

  await pubSub.initialize(process.env.REDISCLOUD_URL)

  for (const [, pluginGetter] of Object.entries(pluginModules)) {
    // Get the actual class from the getter
    const PluginClass = pluginGetter

    // Check if PluginClass is a subclass of CorePlugin
    if (checkIfCorePlugin(PluginClass)) {
      // Create an instance of the plugin
      // @ts-ignore
      const pluginInstance = new PluginClass(connection, '000000000', pubSub)
      plugins.push(pluginInstance)
    }
  }
  return plugins
}

const getCredentials = plugins => {
  const credentials: PluginCredential[] = []
  for (const plugin of plugins) {
    const pluginCredentials = plugin.credentials
    credentials.push(...pluginCredentials)
  }
  return credentials
}

const clearPlugins = async () => {
  plugins.forEach(plugin => {
    plugin.destroy()
  })
  plugins = []
}

async function writeConfig(fileLocation: string) {
  console.log('WRITING CONFIG!!!!!!!!!!!!!!!!!!!')
  // Get the registry from all plugins
  const plugins = await loadPlugins()

  const registry = await getUnifiedRegistry(plugins)

  // Write the registry to JSON
  const nodeSpecsJson = writeNodeSpecsToJSON(registry)

  console.log('WRITING NODE SPECS')

  //
  fs.writeFileSync(
    path.join(fileLocation),
    JSON.stringify(nodeSpecsJson, null, 2)
  )

  const credentials = getCredentials(plugins)
  // Write the credentials to file
  console.log('WRITING CREDENTIALS')
  fs.writeFileSync(
    path.join('./packages/shared/nodeSpec/src/credentials.json'),
    JSON.stringify(credentials, null, 2)
  )

  console.log('DONE WRITING NODE SPECS')
  clearPlugins()
}

writeConfig(path.resolve('./packages/shared/nodeSpec/src/nodeSpec.json'))

module.exports = {
  writeConfig,
}
