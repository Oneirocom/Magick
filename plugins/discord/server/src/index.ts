// DOCUMENTED
import {
  eventSocket,
  ServerPlugin,
  triggerSocket,
  WorldManager,
} from '@magickml/core'
import { DiscordConnector } from './connectors/discord'

type StartDiscordArgs = {
  agent: any
  spellRunner: any
  worldManager: WorldManager
}

/**
 * Get startDiscord and stopDiscord methods to manage Discord connections.
 * @returns An object with startDiscord and stopDiscord methods.
 */
function getAgentMethods() {
  /**
   * Start a new Discord connection for this agent.
   * @param args - An object containing the agent, spellRunner, and worldManager.
   */
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

    try {
      const discord = new DiscordConnector({
        ...data,
        agent,
        spellRunner,
        worldManager,
      })
      agent.discord = discord
    } catch (err) {
      console.error('Error starting discord client for agent ' + agent.name)
    }
  }

  /**
   * Stop the current Discord connection for this agent.
   * @param args - An object containing the agent.
   */
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

/**
 * Handle the response from the input plugin and send it to Discord.
 * @param args - An object containing the output, agent, and event.
 */
async function handleResponse({ output, agent, event }) {
  if (!output || output === '')
    return console.warn('No output to send to discord')
  await agent.discord.sendMessageToChannel(event.channel, output)
  console.log('RESPONSE HANDLED')
}

// Input socket configurations
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

// Output socket configurations
const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
]

/**
 * DiscordPlugin: Handles the integration with Discord,
 * including voice and text interactions.
 */
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
