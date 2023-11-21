// DOCUMENTED
import {
  audioSocket,
  eventSocket,
  ServerPlugin,
  triggerSocket,
} from 'shared/core'
import { DiscordConnector } from './connectors/discord'
import { handleVoiceResponse } from './connectors/discord-voice'

import { getNodes } from '@magickml/plugin-discord-shared'
import { AgentEvents } from 'server/event-tracker'
type StartDiscordArgs = {
  agent: any
  spellRunner: any
}

/**
 * Get startDiscord and stopDiscord methods to manage Discord connections.
 * @returns An object with startDiscord and stopDiscord methods.
 */
function getAgentMethods() {
  /**
   * Start a new Discord connection for this agent.
   * @param args - An object containing the agent and spellRunner.
   */
  async function startDiscord({ agent, spellRunner }: StartDiscordArgs) {
    const { data } = agent.data
    if (!data) return agent.log('No data for this agent')
    if (!data.discord_enabled)
      return agent.log('Discord is not enabled for this agent')
    if (!data.discord_api_key)
      return agent.log('Discord API key is not set for this agent')

    try {
      const discord = new DiscordConnector({
        ...data,
        agent,
        spellRunner,
      })
      agent.discord = discord

      await discord.initialize()
    } catch (err: any) {
      agent.error('Error starting discord client for agent ' + agent.id, {
        message: err.message,
        stack: err.stack,
      })
      agent.discord.destroy()
      agent.discord = null
      throw err
    }
  }

  /**
   * Stop the current Discord connection for this agent.
   * @param args - An object containing the agent.
   */
  async function stopDiscord({ agent }) {
    if (!agent.discord)
      return agent.warn("Discord isn't running, can't stop it")
    try {
      await agent.discord.destroy()
      agent.discord = null
    } catch {
      agent.warn('Agent does not exist!')
    }
    agent.log('Stopped discord client for agent ' + agent.name)
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
    return agent.logger.warn('No output to send to discord')

  agent.trackEvent(AgentEvents.AGENT_DISCORD_RESPONSE, {}, event)
  await agent?.discord?.sendMessageToChannel(event.channelId, output)
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

const audioOutputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: audioSocket,
  },
]

/**
 * DiscordPlugin: Handles the integration with Discord,
 * including voice and text interactions.
 */
const DiscordPlugin = new ServerPlugin({
  name: 'DiscordPlugin',
  nodes: getNodes(),
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
    {
      name: 'Discord (DM)',
      defaultResponseOutput: 'Discord (DM)',
      sockets: inputSockets,
    },
  ],
  outputTypes: [
    {
      name: 'Discord (Voice)',
      sockets: audioOutputSockets,
      handler: async ({ output, agent, event }) => {
        const metadata = {
          channel: 'discord_voice',
        }
        agent.trackEvent(AgentEvents.AGENT_DISCORD_MESSAGE, metadata, event)
        await handleVoiceResponse({ output, agent, event })
      },
    },
    {
      name: 'Discord (DM)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        const metadata = {
          channel: 'discord_dm',
        }
        agent.trackEvent(AgentEvents.AGENT_DISCORD_MESSAGE, metadata, event)
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Discord (Text)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        const metadata = {
          channel: 'discord_text',
        }
        agent.trackEvent(AgentEvents.AGENT_DISCORD_MESSAGE, metadata, event)
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Discord (Image)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        const metadata = {
          channel: 'discord_image',
        }
        agent.trackEvent(AgentEvents.AGENT_DISCORD_MESSAGE, metadata, event)
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
