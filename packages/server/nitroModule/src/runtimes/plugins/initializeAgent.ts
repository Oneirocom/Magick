// @ts-ignore
import magickSpells from '#magick/spells'
import { initApp } from '@magickml/agent-server'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { Agent } from '@magickml/agents'
import { AgentInterface } from '@magickml/agent-server-schemas'
import { NitroRuntimeConfig } from 'nitropack'

type Config = NitroRuntimeConfig & AgentInterface

export default defineNitroPlugin(async nitroApp => {
  const app = (await initApp()) as any

  const runtimeConfig = useRuntimeConfig<Config>()

  nitroApp.agentServer = app

  // // use data and app to create agent
  const agent = new Agent(runtimeConfig, app.get('pubsub'), app)
  await agent.waitForInitialization()
  await agent.spellbook.loadSpells(magickSpells)

  nitroApp.agent = agent
})
