import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
// @ts-ignore
import magickPlugins from '#magick/plugins'
import { initApp } from 'server/core'
import { AgentV2 as Agent, AgentConfig } from 'server/grimoire'
import { useRuntimeConfig } from 'nitropack/runtime'

export default defineNitroPlugin(async nitroApp => {
  const app = await initApp()

  const runtimeConfig = useRuntimeConfig()

  console.log('runtimeConfig', runtimeConfig)

  nitroApp.agentServer = app

  // get agent data from agent server from configured agent id
  const agentData = await app.service('agents').get(runtimeConfig.agentId)

  const agentConfig: AgentConfig = {
    pubsub: app.get('pubsub'),
    app,
    useInternalPlugins: false,
  }

  // // use data and app to create agent
  const agent = new Agent(agentData, agentConfig)

  magickPlugins.forEach((plugin: any) => {
    // TODo we will clean this up and make it better
    // maybe put a register plugin directly on the agent
    const instance = new plugin.constructor({
      agent,
      connection: app.get('redis'),
      pubSub: app.get('pubsub'),
      projectId: agent.projectId,
    })

    agent.pluginManager.registerPlugin(instance)
  })

  nitroApp.agent = agent
})
