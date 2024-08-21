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

  let agentId: string | undefined

  try {
    const configFile = fs.readFileSync('agent-config.json', 'utf8')
    const configData = JSON.parse(configFile)
    agentId = configData.AGENT_ID
  } catch (error) {
    console.error('Error reading agent-config.json:', error)
  }

  agentId = agentId || runtimeConfig.agentId

  const existingAgent = await prisma.agents.findUnique({
    where: {
      id: agentId || '',
    },
  })

  if (!existingAgent) {
    const agent = await prisma.agents.create({
      data: {
        id: agentId as string,
        name: agentId as string,
        enabled: true,
        version: '2.0',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isDraft: false,
        projectId: (runtimeConfig.projectId || 'default') as string,
        worldId: (runtimeConfig.worldId || 'default') as string,
      },
    })

    // Write to a JSON file
    const configData = { AGENT_ID: agent.id }
    fs.writeFileSync('agent-config.json', JSON.stringify(configData, null, 2))
    console.log('Agent created:', agent.id)
    runtimeConfig.agentId = agent.id
  }

  // // use data and app to create agent
  const agent = new Agent(runtimeConfig, app.get('pubsub'), app)
  await agent.waitForInitialization()
  await agent.spellbook.loadSpells(magickSpells)

  nitroApp.agent = agent
})
