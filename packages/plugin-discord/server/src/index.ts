import {
  eventSocket,
  ServerPlugin,
  triggerSocket,
  WorldManager,
} from '@magickml/engine'
import { DiscordConnector } from './connectors/discord'
type StartDiscordArgs = {
  agent: any
  spellRunner: any
  worldManager: WorldManager
}

function getAgentMethods() {
  async function startDiscord({
    agent,
    spellRunner,
    worldManager,
  }: StartDiscordArgs) {
    const { data } = agent.data
    if (!data) return console.log('No data for this agent')
    if (!data.discord_enabled)
      return console.log('Discord is not enabled for this agent')
    if (!data.discord_api_key)
      return console.log('Discord API key is not set for this agent')

    const discord = new DiscordConnector({
      ...data,
      agent,
      spellRunner,
      worldManager,
    })
    agent.discord = discord
  }

  async function stopDiscord({ agent }) {
    if (!agent.discord)
      return console.warn("Discord isn't running, can't stop it")
    try {
      await agent.discord.destroy()
      agent.discord = null
    } catch {
      console.warn('Agent does not exist!')
    }
    console.log('Stopped discord client for agent ' + agent.name)
  }

  return {
    start: startDiscord,
    stop: stopDiscord,
  }
}

async function handleResponse({ output, agent, event }) {
  if (!output || output === '')
    return console.warn('No output to send to discord')
  await agent.discord.sendMessageToChannel(event.channel, output)
}

async function handleImageReponse({ output, agent, event }) {
  if(!output || output === '') return console.warn('No output to send to discord')
  await agent.discord.sendMessageToChannel(event.channel, output)
}

// TODO: Change these to be full inputs
const inputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
  {
    socket: 'trigger',
    name: 'trigger',
    type: triggerSocket,
  },
]

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
]

const DiscordPlugin = new ServerPlugin({
  name: 'DiscordPlugin',
  inputTypes: [
    {
      name: 'Discord (Voice)',
      sockets: inputSockets,
      defaultResponseOutput: 'Discord (Voice)',
    },
    {
      name: 'Discord (Text)',
      defaultResponseOutput: 'Discord (Text)',
      sockets: inputSockets,
    },
  ],
  outputTypes: [
    {
      name: 'Discord (Voice)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Discord (Text)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        console.log('output is', output)
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Discord (Image)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        console.log('output is', output)
        await handleResponse({ output, agent, event })
      },
    }
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Discord API Key',
      key: 'discord_api_key',
      global: false,
    },
  ],
})

export default DiscordPlugin
