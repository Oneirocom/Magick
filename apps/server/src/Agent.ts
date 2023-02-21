import { buildMagickInterface } from '../../server/src/buildMagickInterface'
import { tts, tts_tiktalknet } from '@magickml/server-core'
import { SpellManager, pluginManager } from '@magickml/engine'
import { app } from './app'

type StartLoopArgs = {
  spellHandler: any
  loop_interval?: string
  agent_name?: string
}

type EntityData = {
  loop_enabled?: boolean
  loop_interval?: string
  root_spell?: string
  agent_name?: string
  eth_private_key?: string
  eth_public_address?: string
  openai_api_key?: string
  entity?: any
}

export class Agent {
  name = ''
  //Clients
  id: any
  data: EntityData
  router: any
  app: any
  loopHandler: any
  spellManager: SpellManager
  projectId: string

  constructor(data: any) {
    this.id = data.id
    this.data = data
    this.name = data.agent ?? data.name ?? 'agent'
    this.projectId = data.projectId
    this.spellManager = new SpellManager({
      magickInterface: buildMagickInterface({}) as any,
      cache: false,
    })

    this.generateVoices(data);
    (async () => {
      const spell = (await app.service('spells').find({
        query: { projectId: data.projectId, name: data.root_spell },
      })).data[0]

      const spellRunner = await this.spellManager.load(spell)

      // TODO: reenable loop
      // if (data.loop_enabled) {
      //   this.startLoop({ ...data, spellRunner })
      // }

      const agentStartMethods = pluginManager.getAgentStartMethods();
      for (const method of Object.keys(agentStartMethods)) {
        console.log('method', method)
        await agentStartMethods[method]({ ...data, agent: this, spellRunner })
      }
    })()
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
          projectId: this.projectId,
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
    const agentStopMethods = pluginManager.getAgentStopMethods();
    console.log('agentStartMethods', agentStopMethods)
    for (const method of Object.keys(agentStopMethods)) {
      console.log('method', method)
      agentStopMethods[method](this)
    }
  }

  async generateVoices(data: any) {
    if (data.use_voice) {
      const phrases = data.voice_default_phrase
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
