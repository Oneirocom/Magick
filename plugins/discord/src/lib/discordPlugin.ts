import {
  type ActionPayload,
  type BasePluginInit,
  type EventPayload,
} from 'server/plugin'
import { type CorePluginEvents } from 'plugin/core'
import { ChannelType, Client, GatewayIntentBits, TextChannel } from 'discord.js'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { WebSocketPlugin } from 'server/plugin'
import { DiscordMessageUtils } from './services/discord-message-utils'
import { isDiscordToken } from 'token-validation'

import {
  discordPluginCredentials,
  discordDefaultState,
  DISCORD_COMMANDS,
  discordPluginName,
  DISCORD_EVENTS,
  DISCORD_ACTIONS,
  DISCORD_DEPENDENCIES,
  DISCORD_DEVELOPER_MODE,
  type DiscordEventPayload,
  type DiscordCredentials,
  type DiscordPluginState,
  type SendMessage,
} from './configx'

export class DiscordPlugin extends WebSocketPlugin<
  typeof DISCORD_EVENTS,
  typeof DISCORD_ACTIONS,
  typeof DISCORD_DEPENDENCIES,
  typeof DISCORD_COMMANDS,
  DiscordCredentials,
  CorePluginEvents,
  EventPayload<DiscordEventPayload[keyof DiscordEventPayload], any>,
  Record<string, unknown>,
  Record<string, unknown>,
  DiscordPluginState
> {
  defaultState = discordDefaultState
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

  // CONFIG
  getPluginConfig() {
    return {
      events: DISCORD_EVENTS,
      actions: DISCORD_ACTIONS,
      dependencyKeys: DISCORD_DEPENDENCIES,
      commands: DISCORD_COMMANDS,
      developerMode: DISCORD_DEVELOPER_MODE,
      credentials: discordPluginCredentials,
    }
  }

  // DEPENDENCIES
  async getDependencies() {
    return {
      [discordPluginName]: DiscordEmitter,
      [DISCORD_DEPENDENCIES.DISCORD_KEY]: this.discord,
      [DISCORD_DEPENDENCIES.DISCORD_SEND_MESSAGE]: this.sendMessage.bind(this),
      [DISCORD_DEPENDENCIES.DISCORD_CONTEXT]: this.getContext.bind(this),
    }
  }

  // ACTIONS
  getActionHandlers() {
    return {
      [DISCORD_ACTIONS.sendMessage]: this.handleSendMessage.bind(this),
    }
  }

  // COMMANDS
  getCommandHandlers() {
    return {}
  }

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

  // ABSTRACTS FROM WS PLUGIN & BASE PLUGIN
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
