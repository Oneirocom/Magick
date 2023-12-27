import { Client, GatewayIntentBits } from 'discord.js'
import { EventPayload } from 'packages/server/plugin/src'
import { DiscordCredentials } from '../types'

export class DiscordClient {
  private client: Client

  constructor(
    private credentials: DiscordCredentials,
    private agentId: string,
    private emitEvent: (eventName: string, payload: EventPayload<any>) => void
  ) {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
    })
  }

  async init() {
    console.log('Initializing Discord client...')
    this.validateCredentials(this.credentials)
    this.client.login(this.credentials.token)
    this.setupListeners()
  }

  private validateCredentials(credentials: DiscordCredentials) {
    if (!credentials.token) {
      throw new Error('Missing required Discord credentials: token')
    }
  }

  getClient() {
    return this.client
  }

  private setupListeners() {
    this.client.on('messageCreate', message => {
      console.log('Received message:', message.content)
      if (message.author.bot) {
        return
      }

      const eventPayload: EventPayload<any> = {
        connector: 'discord',
        eventName: 'messageCreate',
        status: 'success',
        content: message.content,
        sender: message.author.id,
        observer: 'assistant',
        client: 'discord',
        channel: message.channelId,
        channelType: message.channel.type.toString(),
        plugin: 'discord',
        agentId: this.agentId,
        rawData: message,
        timestamp: message.createdTimestamp.toString(),
        data: message.toJSON(),
        metadata: {},
      }
      this.emitEvent('messageCreate', eventPayload)
    })
  }
}
