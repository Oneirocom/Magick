import { buildMagickInterface } from '../../server/src/buildMagickInterface'
import { tts, tts_tiktalknet } from '@magickml/server-core'
import { SpellManager } from '@magickml/engine'

import discord_client from './connectors/discord'
import { prisma } from '@magickml/prisma'

type StartLoopArgs = {
  loop_interval?: string
  loop_spell_handler?: string
  agent_name?: string
  eth_private_key?: string
  eth_public_address?: string
}

type StartDiscordArgs = {
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  discord_empty_responses?: string
  discord_spell_handler_incoming?: string
  use_voice?: boolean
  voice_provider?: string
  voice_character?: string
  voice_language_code?: string
  tiktalknet_url?: string
  eth_private_key?: string
  eth_public_address?: string
}

type EntityData = {
  loop_enabled?: boolean
  loop_interval?: string
  loop_spell_handler?: string
  agent_name?: string
  eth_private_key?: string
  eth_public_address?: string
  openai_api_key?: string
  discord_enabled?: boolean
  discord_api_key?: string
  discord_starting_words?: string
  discord_bot_name_regex?: string
  discord_bot_name?: string
  discord_empty_responses?: string
  discord_spell_handler_incoming?: string
  use_voice?: boolean
  voice_provider?: string
  voice_character?: string
  voice_language_code?: string
  tiktalknet_url?: string
  entity?: any
}

export class Agent {
  name = ''
  //Clients
  discord: discord_client | null
  id: any
  rawAgent: Record<string, any>
  data: EntityData
  router: any
  app: any
  loopHandler: any
  spellManager: SpellManager

  async createSpellHandler({ spell }) {
    const spellRunner = await this.spellManager.load(spell)
    await prisma.agents.update({
      where: { id: this.id },
      data: {
        spells: {
          connect: {
            id: spell.id,
          },
        },
      },
    })

    return async function spellHandler({
      content,
      sender,
      observer,
      client,
      channel,
      channelType,
      entities,
      agentId = this.id,
    }) {
      const spellInputs = {
        input: {
          content,
          sender,
          observer,
          client,
          channel,
          channelType,
          agentId,
          entities,
        } as any,
      }
      const spellOutputs = await spellRunner.defaultRun(spellInputs)
      return spellOutputs
    }
  }

  constructor(agent: any) {
    this.onDestroy()
    this.id = agent.id
    this.rawAgent = agent
    this.data = agent.data
    console.log('initing agent')
    console.log('agent data is ', agent)
    this.name = agent.agent ?? agent.name ?? 'agent'
    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}),
      cache: false,
    })

    const data = this.data

    this.generateVoices(data)

    if (data.loop_enabled) {
      this.startLoop(data)
    }

    if (data.discord_enabled) {
      this.startDiscord(data)
    }
  }

  async startDiscord({
    discord_api_key,
    discord_starting_words,
    discord_bot_name_regex,
    discord_bot_name,
    discord_empty_responses,
    discord_spell_handler_incoming,
    use_voice,
    voice_provider,
    voice_character,
    voice_language_code,
    tiktalknet_url,
    eth_private_key,
    eth_public_address,
  }: StartDiscordArgs) {
    console.log(
      'initializing discord, spell_handler:',
      discord_spell_handler_incoming
    )
    if (this.discord)
      throw new Error('Discord already running for this agent on this instance')

    const spell = await prisma.spells.findUnique({
      where: { name: discord_spell_handler_incoming },
    })

    console.log('discord incoming spell', spell)

    const spellHandler = await this.createSpellHandler({ spell })

    this.discord = new discord_client()
    console.log('createDiscordClient')
    await this.discord.createDiscordClient(
      this,
      discord_api_key,
      discord_starting_words,
      discord_bot_name_regex,
      discord_bot_name,
      discord_empty_responses,
      spellHandler,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      tiktalknet_url
    )
  }

  async stopDiscord() {
    if (!this.discord) throw new Error("Discord isn't running, can't stop it")
    await this.discord.destroy()
    this.discord = null
    console.log('Stopped discord client for agent ' + this.name)
  }

  async startLoop({
    loop_interval,
    loop_spell_handler,
    agent_name,
  }: StartLoopArgs) {
    if (this.loopHandler) {
      throw new Error('Loop already running for this client on this instance')
    }

    const loopInterval = parseInt(loop_interval)
    if (typeof loopInterval === 'number' && loopInterval > 0) {
      const spell = await prisma.spells.findUnique({
        where: { name: loop_spell_handler },
      })

      const spellHandler = await this.createSpellHandler({
        spell,
      })

      this.loopHandler = setInterval(async () => {
        const resp = await spellHandler({
          content: 'loop',
          sender: 'loop',
          observer: agent_name,
          client: 'loop',
          channel: 'auto',
          channelType: 'loop',
          entities: [],
        })
        if (resp?.length > 0) {
          console.log('Loop Response:', resp)
        }
      }, loopInterval)
    } else {
      throw new Error('Loop Interval must be a number greater than 0')
    }
  }
  async stopLoop() {
    if (this.loopHandler && this.loopHandler !== undefined) {
      clearInterval(this.loopHandler)
      this.loopHandler = null
    }
  }


  async onDestroy() {
    if (this.discord) this.stopDiscord()
  }

  async generateVoices(data: any) {
    if (data.use_voice) {
      const phrases = data.voice_default_phrases
      if (phrases && phrases.length > 0) {
        const pArr = phrases.split('|')
        for (let i = 0; i < pArr.length; i++) {
          pArr[i] = pArr[i].trim()
        }
        const filtered = pArr.filter(
          (p: string) => p && p !== undefined && p?.length > 0
        )

        for (let i = 0; i < filtered.length; i++) {
          let url: any = ''
          if (data.voice_provider === 'google') {
            url = await tts(
              filtered[i],
              data.voice_character,
              data.voice_language_code
            )
          } else {
            url = await tts_tiktalknet(
              filtered[i],
              data.voice_character,
              data.tiktalknet_url
            )
          }
        }
      }
    }
  }
}

export default Agent
