// @ts-ignore
import magickSpells from '#magick/spells'
import { initApp } from '@magickml/agent-server'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { Agent } from '@magickml/agents'
import { AgentInterface } from '@magickml/agent-server-schemas'
import { NitroRuntimeConfig } from 'nitropack'
import { PrismaClient } from '@magickml/server-db'
import fs from 'fs'

const prisma = new PrismaClient()

type Config = NitroRuntimeConfig & AgentInterface

export default defineNitroPlugin(async nitroApp => {
  const app = (await initApp()) as any

  const runtimeConfig = useRuntimeConfig<Config>()

  nitroApp.agentServer = app

  const agentId = runtimeConfig.agentId

  const existingAgent = await prisma.agents.findUnique({
    where: {
      id: agentId || '',
    },
  })

  if (!existingAgent) {
    const agent = await prisma.agents.create({
      data: {
        id: agentId,
        name: agentId,
        enabled: true,
        version: '2.0',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isDraft: false,
        projectId: runtimeConfig.projectId || 'default',
        worldId: runtimeConfig.worldId || 'default',
      },
    })

    //write to .env
    fs.writeFileSync('.env', `AGENT_ID=${agent.id}`)
    console.log('Agent created:', agent.id)
    runtimeConfig.agentId = agent.id
  }

  // // use data and app to create agent
  const agent = new Agent(runtimeConfig, app.get('pubsub'), app)
  await agent.waitForInitialization()
  await agent.spellbook.loadSpells(magickSpells)

  nitroApp.agent = agent
})
