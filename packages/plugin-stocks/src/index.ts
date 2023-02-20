import { Plugin } from "@magickml/engine"
import { DiscordAgentWindow } from "../../plugin-discord/src/components/agent.component"
import { GetStockPrice } from "./nodes/GetStockPrice"
import { GetTokenPrice } from "./nodes/GetTokenPrice"

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
  }: StartDiscordArgs) {
    console.log('starting discord stocks plugin')
    // ignore import if vite
    const module = await import(/* @vite-ignore */ `${typeof window === 'undefined' ? '../../plugin-discord/src/connectors/discord' : './dummy'}`)
    discord_client = module.discord_client

    const discord = new discord_client()
    agent.discord = discord
    await discord.createDiscordClient(
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
      tiktalknet_url
    )
  }

  async function stopDiscord(agent) {
    if (!agent.discord) throw new Error("Discord isn't running, can't stop it")
    await agent.discord.destroy()
    agent.discord = null
    console.log('Stopped discord client for agent ' + agent.name)
  }

  return {
    start: startDiscord,
    stop: stopDiscord,
  }
}

const DiscordStocksPlugin = new Plugin({
  name: 'DiscordStocksPlugin', 
  nodes: [ GetStockPrice, GetTokenPrice], 
  services: {},
  agentComponents: [DiscordAgentWindow], 
  windowComponents: [],
  serverInit: null,
  serverRoutes: null,
  agentMethods: getAgentMethods(),
})

export default DiscordStocksPlugin;