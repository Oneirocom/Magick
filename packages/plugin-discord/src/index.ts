import { Plugin } from "../../engine/src" // TODO: fix me
import { DiscordAgentWindow } from "./components/agent.component"
import { DiscordInput } from "./nodes/DiscordInput"
import { DiscordOutput } from "./nodes/DiscordOutput"
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
}

function getAgentMethods() {
  // if we are in node, we need to import the discord client
  if(typeof window !== 'undefined') return
  
  let discord_client
  
  import('./connectors/discord')
  .then((module) => {
    discord_client = module.discord_client
  });

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

const DiscordPlugin = new Plugin({
  name: 'DiscordPlugin', 
  nodes: [DiscordInput, DiscordOutput], 
  services: [['DiscordPlugin',UploadService]],
  agentComponents: [DiscordAgentWindow], 
  windowComponents: [],
  serverInit: null,
  serverRoutes: null,
  setup: ()=>{console.log("DiscordPlugin")}, 
  teardown: ()=>{console.log("DiscordPlugin")},
  agentMethods: getAgentMethods(),
})

export default DiscordPlugin;