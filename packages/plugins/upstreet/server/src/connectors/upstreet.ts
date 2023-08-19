import { Agent as UpstreetAgent } from 'upstreet'
import { app } from '@magickml/server-core'

export class UpstreetConnector {
  upstreetAgent: UpstreetAgent
  spellRunner
  data
  agent
  upstreet_stream_rules = ''
  localUser: any

  constructor({ spellRunner, agent }) {
    this.agent = agent
    this.agent.upstreet = this
    this.spellRunner = spellRunner
    const data = this.agent.data.data
    this.data = data

    if (!data.upstreet_enabled) {
      console.warn('Upstreet is not enabled, skipping')
      return
    }
    console.log('Upstreet enabled, initializing...')

    this.initialize({ data })
  }

  async initialize({ data }) {
    this.upstreetAgent = new UpstreetAgent()
    await this.upstreetAgent.connect()
    this.upstreetAgent.addEventListener('message', message =>
      this.handler(message)
    )
  }

  async handler(message) {
    const author = message.characterName
    const entities = [author, this.agent.name]
    const text = message.text
    const resp = await app.get('agentCommander').runSpell({
      inputs: {
        [`Input - Upstreet (Speak)`]: {
          connector: `Upstreet (Speak)`,
          content: text,
          sender: author,
          observer: this.agent.name,
          client: 'upstreet',
          channel: 'upsteet',
          agentId: this.agent.id,
          entities,
          channelType: 'upsteet',
          rawData: JSON.stringify(message),
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      runSubspell: true,
    })
  }

  async handleSpeak(content, event) {
    await this.upstreetAgent.speak(content)
  }
}
