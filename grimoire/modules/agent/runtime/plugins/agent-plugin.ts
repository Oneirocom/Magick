import consola from 'consola'
import { useRuntimeConfig } from 'nitro/runtime'
import { defineNovaPlugin } from 'nitropack'

import {
  AgentV2 as Agent,
  type AgentConfig,
} from '../../../../../packages/server/agents/src'

export default defineNovaPlugin({
  useRuntimeConfig,
  initialize: async (nitroApp, config) => {
    consola.info('Initializing agent')
    nitroApp.agentClient = await initApp()

    const agentData = await nitroApp.agentClient
      .service('agents')
      .get(config.agentId)

    const agentConfig: AgentConfig = {
      pubsub: nitroApp.agentClient.get('pubsub'),
      app: nitroApp.agentClient,
      useInternalPlugins: false,
    }

    // // use data and app to create agent
    const agent = new Agent(agentData, agentConfig)

    nitroApp.agent = agent

    return {}
  },
  before: (nitro, initResult) => {
    return {}
  },
  after: (nitro, beforeResult) => {
    return {}
  },
  runtimeSetup: {
    plugins: {
      async initFeatureHandlers(nitroApp, handlers) {
        for (const plugin of handlers) {
          const fn = (await plugin.handler()).default

          const instance = new fn.constructor({
            agent: nitroApp.agent,
            connection: nitroApp.agentClient.get('redis'),
            pubSub: nitroApp.agentClient.get('pubsub'),
            projectId: nitroApp.agent.projectId,
          })

          nitroApp.agent.pluginManager.registerPlugin(instance)
        }
      },
      getVirtualHandlers() {
        return []
      },
    },
  },
})

