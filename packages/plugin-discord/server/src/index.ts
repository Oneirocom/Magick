import { eventSocket, ServerPlugin, WorldManager } from '@magickml/engine'
import { discord_client } from './connectors/discord'
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
    const { data } = agent
    if(!data) return console.log("No data for this agent")
    if(!data.discord_enabled) return console.log("Discord is not enabled for this agent")
    if(!data.discord_api_key) return console.log("Discord API key is not set for this agent")

    console.log('starting discord')
      const {
      discord_api_key,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      tiktalknet_url,
      } = data

    console.log({
      discord_api_key,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      tiktalknet_url,
    })
    console.log('discord_api_key', discord_api_key)
    const discord = new discord_client({
      agent,
      discord_api_key,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      spellRunner,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      tiktalknet_url,
      worldManager,
    })
    agent.discord = discord
  }

  async function stopDiscord(agent) {
    console.log('Inside Kill Method')
    if (!agent.discord) return console.warn("Discord isn't running, can't stop it")
    try {
      await agent.discord.destroy()
      agent.discord = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped discord client for agent ' + agent.name)
  }

  return {
    start: startDiscord,
    stop: stopDiscord,
  }
}

const DiscordPlugin = new ServerPlugin({
  name: 'DiscordPlugin',
  inputTypes: [
    { name: 'Discord (Voice)', trigger: true, socket: eventSocket },
    { name: 'Discord (Text)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Discord (Voice)', trigger: false, socket: eventSocket },
    { name: 'Discord (Text)', trigger: false, socket: eventSocket },
  ],
  agentMethods: getAgentMethods(),
  secrets: [{
    name: 'Discord API Key',
    key: 'discord_api_key',
    global: false
  }]
})

export default DiscordPlugin
