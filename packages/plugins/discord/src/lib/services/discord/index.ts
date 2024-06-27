import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { EventPayload } from '@magickml/shared-services'
import { Logger } from 'pino'
import natural from 'natural'
import {
  DISCORD_EVENTS,
  type DiscordEventPayload,
  type DiscordCredentials,
} from '../../configx'

const tokenizer = new natural.SentenceTokenizer()

function tokenizeIntoSentences(content: string) {
  return tokenizer.tokenize(content)
}

function splitLongSentence(sentence: string, maxLength: number) {
  // Split the sentence at logical points, such as punctuation or conjunctions.
  const splitRegex = /,|;|\s-\s/ // Split at commas, semicolons, or dashes. You can refine this regex based on your needs.
  const parts = [] as string[]
  let currentPart = ''

  sentence.split(splitRegex).forEach((chunk, index, array) => {
    if (currentPart.length + chunk.length < maxLength) {
      currentPart +=
        index < array.length - 1 ? chunk + array[index + 1].charAt(0) : chunk
    } else {
      parts.push(currentPart)
      currentPart = chunk
    }
  })

  if (currentPart) {
    parts.push(currentPart)
  }

  return parts
}

export class DiscordClient {
  private client: Client<true>

  constructor(
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
        // @ts-ignore
        const payload = args[0] as DiscordEventPayload[typeof eventName]

        if (this.checkIfBotMessage(payload)) {
          return
        }

        console.log('!!!!!!!!!!!!!!!!event name', eventName)
        this.emitEvent(
          eventName,
          this.createEventPayload<typeof eventName>(eventName, payload)
        )
      }
    )
  }

  public setupAllEventListeners() {
    Object.keys(DISCORD_EVENTS).forEach(eventName => {
      this.setupEventListener(eventName as keyof DiscordEventPayload)
    })
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

  async onMessageCreate(
    handler: (event: EventPayload<DiscordEventPayload['messageCreate']>) => void
  ) {
    this.client.on('messageCreate', (...args) => {
      // have to cast here because of the way discord.js typings are set up
      //@ts-ignore
      const payload = args[0] as DiscordEventPayload['messageCreate']

      if (this.checkIfBotMessage(payload)) {
        return
      }

      const eventPayload = this.createEventPayload('messageCreate', payload)
      handler(eventPayload)
    })
  }

  async sendMessage<K extends keyof DiscordEventPayload>(
    content: string,
    event: EventPayload<DiscordEventPayload[K]>
  ) {
    if (!event.data.channelId) {
      throw new Error('No channel id found')
    }

    try {
      const channel = await this.client.channels.fetch(event.data.channelId)

      if (!channel) {
        throw new Error('No channel found')
      }

      if (channel.type !== ChannelType.GuildText) {
        throw new Error('Channel is not a text channel')
      }

      const MAX_LENGTH = 2000
      const sentences = tokenizeIntoSentences(content) // Function to split content into sentences
      let currentBatch = ''
      const batches = [] as string[]

      for (const sentence of sentences) {
        if (sentence.length > MAX_LENGTH) {
          // If a single sentence is too long, further split it.
          const parts = splitLongSentence(sentence, MAX_LENGTH) // Function to split long sentence
          for (const part of parts) {
            if (currentBatch.length + part.length <= MAX_LENGTH) {
              currentBatch += part
            } else {
              batches.push(currentBatch)
              currentBatch = part
            }
          }
        } else if (currentBatch.length + sentence.length <= MAX_LENGTH) {
          currentBatch += sentence
        } else {
          batches.push(currentBatch)
          currentBatch = sentence
        }
      }

      if (currentBatch) {
        batches.push(currentBatch)
      }

      for (const batch of batches) {
        await (channel as TextChannel).send(batch)
      }
    } catch (err) {
      this.logger.error(err, 'ERROR IN DISCORD SEND MESSAGE')
      throw err
    }
  }

  async login(token: string) {
    this.logger.info('Initializing Discord client...')
    // this.validateCredentials(this.credentials)
    await this.client.login(token)
  }

  public async logout() {
    this.client.removeAllListeners()
    await this.client.destroy()
  }

  getClient() {
    return this.client
  }
}
