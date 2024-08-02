import { useRuntimeConfig } from 'nitropack/runtime'
import { defineNovaPlugin } from 'nova/runtime'

export default defineNovaPlugin({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    // Perform initialization tasks

    console.log('Initializing nodes feature')
    return {
      /* initialization result */
    }
  },
  before: (nitro, initResult) => {
    // Run tasks before feature initialization
    return {
      /* before result */
    }
  },
  after: (nitro, beforeResult) => {
    // Run tasks after feature initialization

    return {}
  },
  runtimeSetup: {
    nodes: {
      initFeatureHandlers: async (nitro, handlers) => {
        // Initialize API handlers
        console.log('Initializing nodes feature handlers')
      },
      getVirtualHandlers: () => {
        // Return virtual handlers for the API feature
        return []
      },
    },
    // ... other features
  },
})

// export default defineNitroPlugin(async nitroApp => {
//   const app = (await initApp()) as any

//   const runtimeConfig = useRuntimeConfig()

//   nitroApp.agentServer = app

//   // get agent data from agent server from configured agent id
//   const agentData = await app.service('agents').get(runtimeConfig.agentId)

//   const agentConfig: AgentConfig = {
//     pubsub: app.get('pubsub'),
//     app,
//     useInternalPlugins: false,
//   }

//   // // use data and app to create agent
//   const agent = new Agent(agentData, agentConfig)

//   magickPlugins.forEach((plugin: any) => {
//     // TODo we will clean this up and make it better
//     // maybe put a register plugin directly on the agent
//     const instance = new plugin.constructor({
//       agent,
//       connection: app.get('redis'),
//       pubSub: app.get('pubsub'),
//       projectId: agent.projectId,
//     })

//     agent.pluginManager.registerPlugin(instance)
//   })

//   nitroApp.agent = agent
// })
