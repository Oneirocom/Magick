import { Client, GatewayIntentBits } from 'discord.js'
import { EventPayload } from 'server/plugin'
import { DiscordCredentials, DiscordEventPayload } from '../../types'
import { Logger } from 'pino'
import { DISCORD_EVENTS } from '../../constants'

export class DiscordClient {
  private client: Client

  constructor(
    private credentials: DiscordCredentials,
    private agentId: string,
    private emitEvent: (eventName: string, payload: EventPayload<any>) => void,
    private logger: Logger
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildInvites,
      ],
    })
  }

  private validateCredentials(credentials: DiscordCredentials) {
    if (!credentials) {
      throw new Error('Missing required Discord credentials: token')
    }
  }

  private setupEventListener(eventName: keyof DiscordEventPayload) {
    this.client.on(
      eventName,

      (...args) => {
        // have to cast here because of the way discord.js typings are set up
        // they have a whole seperate library of the correct types returned from each event
        const payload = args[0] as DiscordEventPayload[typeof eventName]

        if (this.checkIfBotMessage(payload)) {
          return
        }
        this.emitEvent(
          eventName,
          this.createEventPayload<typeof eventName>(eventName, payload)
        )
      }
    )
  }

  private checkIfBotMessage<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    return 'author' in payload && payload.author?.bot
  }

  private createEventPayload<K extends keyof DiscordEventPayload>(
    eventName: K,
    payload: DiscordEventPayload[K]
  ): EventPayload<DiscordEventPayload[K]> {
    return {
      connector: 'discord',
      eventName,
      status: 'success',
      content: this.parseContent(payload),
      sender: this.parseSender(payload),
      observer: 'assistant',
      client: 'cloud.magickml.com',
      channel: this.parseChannel(payload),
      plugin: 'discord',
      agentId: this.agentId,
      channelType: 'discord',
      rawData: JSON.stringify(payload),
      timestamp: new Date().toISOString(),
      data: payload,
      metadata: {},
    }
  }

  private parseContent<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    if ('content' in payload) {
      return payload.content
    }
    if ('emoji' in payload) {
      return payload.emoji.name ?? ''
    }
    return ''
  }

  private parseSender<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    if ('author' in payload) {
      return payload.author?.id ?? ''
    }
    return ''
  }

  private parseChannel<K extends keyof DiscordEventPayload>(
    payload: DiscordEventPayload[K]
  ) {
    if ('channelId' in payload) {
      return payload.channelId as string
    }
    return ''
  }

  async init() {
    this.logger.info('Initializing Discord client...')
    this.validateCredentials(this.credentials)
    await this.client.login(this.credentials)
    Object.keys(DISCORD_EVENTS).forEach(eventName => {
      this.setupEventListener(eventName as keyof DiscordEventPayload)
    })
  }

  getClient() {
    return this.client
  }
}
