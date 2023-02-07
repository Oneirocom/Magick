import { buildMagickInterface } from '../../server/src/buildMagickInterface'
import { tts, tts_tiktalknet } from '@magickml/server-core'
import { SpellManager } from '@magickml/engine'
import { app } from './app'

import discord_client from './connectors/discord'

type StartLoopArgs = {
  spellHandler: any
  loop_interval?: string
  agent_name?: string
}

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

type EntityData = {
  loop_enabled?: boolean
  loop_interval?: string
  root_spell?: string
  agent_name?: string
  eth_private_key?: string
  eth_public_address?: string
  openai_api_key?: string
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
  entity?: any
}

export class Agent {
  name = ''
  //Clients
  discord: discord_client | null
  id: any
  data: EntityData
  router: any
  app: any
  loopHandler: any
  spellManager: SpellManager

  async createSpellHandler({ spell }) {
    const spellRunner = await this.spellManager.load(spell)
    // await prisma.agents.update({
    //   where: { id: this.id },
    //   data: {
    //     spells: {
    //       connect: {
    //         id: spell.id,
    //       },
    //     },
    //   },
    // })
    // rewrite as a feathers service
    await app.service('agents').patch(this.id, {
      spells: {
        // TODO: this must be wrong?
        // @ts-ignore
        connect: {
          id: spell.id,
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

  constructor(data: any) {
    this.onDestroy()
    this.id = data.id
    console.log('agent is', data)
    this.data = data
    this.name = data.agent ?? data.name ?? 'agent'
    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    })

    this.generateVoices(data);
    (async () => {

      const spell = await app.service('spells').find({
        query: { name: data.root_spell },
      })
      
      const spellHandler = await this.createSpellHandler({
        spell,
      })
            
      if (data.loop_enabled) {
        this.startLoop({...data, spellHandler})
      }

    if (data.discord_enabled) {
      this.startDiscord({...data, spellHandler})
    }
  })()
  }

  async startDiscord({
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

  async stopDiscord() {
    if (!this.discord) throw new Error("Discord isn't running, can't stop it")
    await this.discord.destroy()
    this.discord = null
    console.log('Stopped discord client for agent ' + this.name)
  }

  async startLoop({
    spellHandler,
    loop_interval,
    agent_name,
  }: StartLoopArgs) {
    if (this.loopHandler) {
      throw new Error('Loop already running for this client on this instance')
    }

    const loopInterval = parseInt(loop_interval)
    if (typeof loopInterval === 'number' && loopInterval > 0) {
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
