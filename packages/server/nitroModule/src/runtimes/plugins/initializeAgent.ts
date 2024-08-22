// @ts-ignore
import magickSpells from '#magick/spells'
import { initApp } from '@magickml/agent-server'
import { defineNitroPlugin, useRuntimeConfig } from 'nitropack/runtime'
import { Agent } from '@magickml/agents'
import { AgentInterface } from '@magickml/agent-server-schemas'
import { NitroRuntimeConfig } from 'nitropack'
import { PrismaClient } from '@magickml/server-db'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

const prisma = new PrismaClient()

type Config = NitroRuntimeConfig & AgentInterface

export default defineNitroPlugin(async nitroApp => {
  const app = (await initApp()) as any

  const runtimeConfig = useRuntimeConfig<Config>()
  const config = { ...runtimeConfig }

  nitroApp.agentServer = app

  let agentId: string | undefined

  try {
    const configFile = fs.readFileSync('agent-config.json', 'utf8')
    const configData = JSON.parse(configFile)
    agentId = configData.AGENT_ID
  } catch (error) {
    console.error('Error reading agent-config.json:', error)
  }

  agentId = agentId || runtimeConfig.agentId || uuidv4()

  const existingAgent = await prisma.agents.findUnique({
    where: {
      id: agentId,
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
        projectId: runtimeConfig.projectId || 'default',
        worldId: runtimeConfig.worldId || 'default',
      },
    })

    console.log('Agent created:', agent.id)
    console.log('AGHHHH')

    // Double-check that the agent was created
    const verifyAgent = await prisma.agents.findUnique({
      where: { id: agent.id },
    })

    if (!verifyAgent) {
      console.error('Agent creation failed or not immediately visible')
    } else {
      console.log('Agent verified in database')
    }

    const configData = { AGENT_ID: agent.id }
    fs.writeFileSync('agent-config.json', JSON.stringify(configData, null, 2))

    config.agentId = agent.id
    config.id = agent.id
  } else {
    console.log('Existing agent found:', existingAgent.id)
    config.agentId = existingAgent.id
    config.id = existingAgent.id
  }
  // // use data and app to create agent
  const agent = new Agent(config, app.get('pubsub'), app)
  await agent.waitForInitialization()
  await agent.spellbook.loadSpells(magickSpells)

  nitroApp.agent = agent
})
