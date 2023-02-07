//Creating two endpoint for discord
// 1. Input for Discord Input Node
//    1. EntityID
//    2. Content
//    3. Sender
import type { Params } from '@feathersjs/feathers'
import { Plugin } from "../../engine/src" // TODO: fix me
import { DiscordAgentWindow } from "./components/agent.component"
import { DiscordInput } from "./nodes/DiscordInput"
import { DiscordOutput } from "./nodes/DiscordOutput"
import { UploadService } from './services/Upload/Upload.utils'

import { discord_client } from './connectors/discord'

type StartDiscordArgs = {
  spellHandler: any
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

  async function startDiscord({
    spellHandler,
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
    if (this.discord)
      throw new Error('Discord already running for this agent on this instance')

    this.discord = new discord_client()
    await this.discord.createDiscordClient(
      this,
      discord_api_key,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      spellHandler,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      tiktalknet_url
    )
  }

  async function stopDiscord() {
    if (!this.discord) throw new Error("Discord isn't running, can't stop it")
    await this.discord.destroy()
    this.discord = null
    console.log('Stopped discord client for agent ' + this.name)
  }

const DiscordPlugin = new Plugin({
  name: 'DiscordPlugin', 
  nodes: [DiscordInput, DiscordOutput], 
  services: [UploadService], 
  agentComponents: [DiscordAgentWindow], 
  windowComponents: [], 
  setup: ()=>{console.log("DiscordPlugin")}, 
  teardown: ()=>{console.log("DiscordPlugin")},
  agentMethods: {
    start: startDiscord,
    stop: stopDiscord,
  },
})

export default DiscordPlugin;