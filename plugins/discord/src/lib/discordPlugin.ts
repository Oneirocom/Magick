import {
  type ActionPayload,
  type BasePluginInit,
  type EventPayload,
} from 'server/plugin'
import { type CorePluginEvents } from 'plugin/core'
import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import {
  DISCORD_EVENTS,
  DISCORD_DEP_KEYS,
  discordPluginCredentials,
  discordDefaultState,
  discordPluginName,
  type DiscordCredentials,
  type DiscordEventPayload,
  type DiscordPluginState,
  SendMessage,
  DISCORD_DEVELOPER_MODE,
  DISCORD_ACTIONS,
} from './config'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { EventTypes } from 'communication'
import { WebSocketPlugin } from 'plugin-abstracts'
import { DiscordMessageUtils } from './services/discord-message-utils'
import { isDiscordToken } from 'token-validation'

interface DiscordPluginConfig {
  pluginName: typeof discordPluginName
  events: typeof DISCORD_EVENTS
  actions: typeof DISCORD_ACTIONS
  dependencyKeys: typeof DISCORD_DEP_KEYS
  developerMode: typeof DISCORD_DEVELOPER_MODE
}

export class DiscordPlugin extends WebSocketPlugin<
  typeof DISCORD_EVENTS,
  typeof DISCORD_ACTIONS,
  typeof DISCORD_DEP_KEYS,
  CorePluginEvents,
  EventPayload<DiscordEventPayload[keyof DiscordEventPayload], any>,
  Record<string, unknown>,
  Record<string, unknown>,
  DiscordPluginState,
  DiscordCredentials
> {
  override defaultState = discordDefaultState
  nodes = [...onDiscordMessageNodes, sendDiscordMessage]
  values = []
  credentials = discordPluginCredentials
  state = []
  discord = new Client({
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
  utils = new DiscordMessageUtils(this.agentId)

  constructor({ connection, agentId, projectId }: BasePluginInit) {
    super({ name: discordPluginName, connection, agentId, projectId })
  }

  // DISCORD METHODS
  handleSendMessage<K extends keyof DiscordEventPayload>(
    actionPayload: ActionPayload<DiscordEventPayload[K]>
  ) {
    const { event } = actionPayload
    const { plugin } = event
    if (plugin === discordPluginName) {
      // this.client.sendMessage(actionPayload)
    } else {
      this.centralEventBus.emit('createMessage', actionPayload)
    }
  }

  // this is unused, but is for sending messages from discord to magick i think
  async onMessageCreate(
    handler: (event: EventPayload<DiscordEventPayload['messageCreate']>) => void
  ) {
    this.discord.on('messageCreate', (...args) => {
      // have to cast here because of the way discord.js typings are set up
      //@ts-ignore
      const payload = args[0] as DiscordEventPayload['messageCreate']

      if (this.utils.checkIfBotMessage(payload)) {
        return
      }

      const eventPayload = this.utils.createEventPayload(
        'messageCreate',
        payload,
        this.getContext()
      )
      handler(eventPayload)
    })
  }

  // ABSTRACT IMPLEMENTATIONS FROM WS PLUGIN
  getWSPluginConfig(): DiscordPluginConfig {
    return {
      pluginName: discordPluginName,
      events: DISCORD_EVENTS,
      actions: DISCORD_ACTIONS,
      dependencyKeys: DISCORD_DEP_KEYS,
      developerMode: DISCORD_DEVELOPER_MODE,
    }
  }

  async login(credentials: DiscordCredentials) {
    await this.discord.login(credentials['discord-token'])
    this.logger.info('Logged in to Discord')
  }

  validateLogin() {
    return this.discord.user !== null
  }

  validatePermissions() {
    // TODO
    return true
  }

  async logout() {
    this.unlistenAll()
    await this.discord.destroy()
    this.logger.info('Logged out of Discord')
  }

  getContext() {
    const orString = (str: string | null | undefined) => (str ? str : '')
    const user = this.discord.user
    return {
      id: orString(user?.id),
      username: orString(user?.username),
      displayName: orString(user?.username),
      avatar: orString(user?.avatar),
      banner: orString(user?.banner),
      platform: discordPluginName,
    }
  }

  validateCredentials(credentials: DiscordCredentials) {
    if (!credentials?.['discord-token']) {
      return false
    }

    if (!isDiscordToken(credentials['discord-token'])) {
      return false
    }

    return credentials
  }

  listen(eventName: keyof DiscordEventPayload) {
    this.discord.on(
      eventName,

      (...args) => {
        // have to cast here because of the way discord.js typings are set up
        // they have a whole seperate library of the correct types returned from each event
        const payload = args[0] as DiscordEventPayload[typeof eventName]

        if (this.utils.checkIfBotMessage(payload)) {
          return
        }

        console.log('!!!!!!!!!!!!!!!!event name', eventName)
        this.emitEvent(
          eventName,
          this.utils.createEventPayload<typeof eventName>(
            eventName,
            payload,
            this.getContext()
          )
        )
      }
    )
  }

  unlisten(eventName: keyof DiscordEventPayload) {
    this.discord.removeAllListeners(eventName)
  }

  // ABSTRACT IMPLEMENTATIONS FROM BASE/CORE PLUGIN
  async getDependencies() {
    return {
      [discordPluginName]: DiscordEmitter,
      [DISCORD_DEP_KEYS.DISCORD_KEY]: this.discord,
      [DISCORD_DEP_KEYS.DISCORD_SEND_MESSAGE]: this.sendMessage.bind(this),
      [DISCORD_DEP_KEYS.DISCORD_CONTEXT]: this.getContext.bind(this),
    }
  }

  defineActions(): void {
    this.registerAction({
      actionName: EventTypes.SEND_MESSAGE,
      displayName: 'Send Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  sendMessage: SendMessage = async (content, event) => {
    if (!event.data.channelId) {
      throw new Error('No channel id found')
    }

    try {
      const channel = await this.discord.channels.fetch(event.data.channelId)

      if (!channel) {
        throw new Error('No channel found')
      }

      if (channel.type !== ChannelType.GuildText) {
        throw new Error('Channel is not a text channel')
      }

      const MAX_LENGTH = 2000
      const sentences = this.utils.tokenizeIntoSentences(content) // Function to split content into sentences
      let currentBatch = ''
      const batches = [] as string[]

      for (const sentence of sentences) {
        if (sentence.length > MAX_LENGTH) {
          // If a single sentence is too long, further split it.
          const parts = this.utils.splitLongSentence(sentence, MAX_LENGTH) // Function to split long sentence
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

  formatPayload(events: any, payload: any) {
    return payload
  }
}
