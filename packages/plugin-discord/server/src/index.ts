import { eventSocket, ServerPlugin, WorldManager } from '@magickml/engine'
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
  if(!output) return console.warn('No output to send to discord')
  await agent.discord.sendMessageToChannel(event.channel, output)
}

const DiscordPlugin = new ServerPlugin({
  name: 'DiscordPlugin',
  inputTypes: [
    {
      name: 'Discord (Voice)',
      trigger: true,
      socket: eventSocket,
      defaultResponseOutput: 'Discord (Voice)',
    },
    {
      name: 'Discord (Text)',
      trigger: true,
      socket: eventSocket,
      defaultResponseOutput: 'Discord (Text)',
    },
  ],
  outputTypes: [
    {
      name: 'Discord (Voice)',
      trigger: true,
      socket: eventSocket,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Discord (Text)',
      trigger: true,
      socket: eventSocket,
      handler: async ({ output, agent, event }) => {
        console.log('output is', output)
        await handleResponse({ output, agent, event })
      },
    },
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
