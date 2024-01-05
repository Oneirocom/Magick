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
  const connection = new Redis({
    maxRetriesPerRequest: null,
  })

  const pubSub = new RedisPubSub()

  await pubSub.initialize({
    url: REDISCLOUD_URL,
  })

  const plugins = []
  for (const [pluginName, pluginGetter] of Object.entries(pluginModules)) {
    const PluginClass = pluginGetter

    if (checkIfCorePlugin(PluginClass)) {
      const pluginInstance = new PluginClass(connection, '000000000', pubSub)
      plugins.push(pluginInstance)
    }
  }
  return plugins
}

async function writeNodeSpecsToFile(fileLocation) {
  const plugins = await loadPlugins()
  const registry = getUnifiedRegistry(plugins)
  const nodeSpecsJson = writeNodeSpecsToJSON(registry)

  console.log('WRITING NODE SPECS')
  fs.writeFileSync(
    path.join(fileLocation),
    JSON.stringify(nodeSpecsJson, null, 2)
  )
  console.log('DONE WRITING NODE SPECS')
}

const extractCredentials = plugins => {
  const credentialsMap = {}
  for (const plugin of plugins) {
    const pluginName = plugin.constructor.name
    if (plugin.credentials && plugin.credentials.length > 0) {
      credentialsMap[pluginName] = plugin.credentials.map(credential => ({
        name: credential.name,
        serviceType: credential.serviceType,
        credentialType: credential.credentialType,
      }))
    } else {
      credentialsMap[pluginName] = []
    }
  }
  return credentialsMap
}

async function writeCredentialsToFile(fileLocation) {
  try {
    const credentialsMap = extractCredentials(await loadPlugins())

    const absolutePath = path.resolve(fileLocation)
    fs.writeFileSync(absolutePath, JSON.stringify(credentialsMap, null, 2))
    console.log('Credentials JSON written to file:', absolutePath)
  } catch (error) {
    console.error('Error writing credentials to file:', error)
  }
}

;(async () => {
  await writeNodeSpecsToFile(
    path.resolve('./packages/shared/nodeSpec/src/nodeSpec.json')
  )
  await writeCredentialsToFile(
    path.resolve('./packages/shared/nodeSpec/src/credentials.json')
  )
})()
