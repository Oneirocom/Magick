import { ServerPlugin, WorldManager } from "@magickml/engine"
import { UploadService } from './services/Upload/Upload.class'

type StartDiscordArgs = {
  agent: any,
  spellRunner: any
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  use_voice?: boolean
  voice_provider?: string
  voice_character?: string
  voice_language_code?: string
  tiktalknet_url?: string
  worldManager: WorldManager
}

function getAgentMethods() {
  let discord_client
  
  async function startDiscord({
    agent,
    spellRunner,
    discord_api_key,  
    discord_starting_words,
    discord_bot_name_regex,
    discord_bot_name,
    use_voice,
    voice_provider,
    voice_character,
    voice_language_code,
    tiktalknet_url,
    worldManager
  }: StartDiscordArgs) {
    console.log('starting discord')
    // ignore import if vite
    const module = await import(/* @vite-ignore */ `${typeof window === 'undefined' ? './connectors/discord' : './dummy'}`)
    discord_client = module.discord_client

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
      worldManager
    })
    agent.discord = discord
  }

  async function stopDiscord(agent) {
    console.log("Inside Kill Method")
    if (!agent.discord) throw new Error("Discord isn't running, can't stop it")
    try{
      await agent.discord.destroy()
      agent.discord = null
    } catch {
      console.log("Agent does not exist !")
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
  nodes: [], 
  services: {'DiscordPlugin': UploadService},
  inputTypes: ['Discord (Voice)', 'Discord (Text)'],
  outputTypes: ['Discord (Voice)', 'Discord (Text)'],
  serverInit: null,
  serverRoutes: null,
  agentMethods: getAgentMethods(),
})

export default DiscordPlugin;