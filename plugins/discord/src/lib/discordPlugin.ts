import { Client, ChannelType, TextChannel } from 'discord.js'
import {
  DISCORD_EVENTS,
  DISCORD_DEPENDENCIES,
  discordPluginCredentials,
  discordDefaultState,
  discordPluginName,
  discordIntents,
  type DiscordCredentials,
  type DiscordEventPayload,
  type DiscordPluginState,
  SendMessage,
  DISCORD_DEVELOPER_MODE,
  DISCORD_ACTIONS,
  DISCORD_COMMANDS,
  DiscordEvent,
} from './config'
import {
  WebSocketPlugin,
  BasePluginInit,
  type ActionPayload,
} from 'plugin-experimental'
import { DiscordMessageUtils } from './services/discord-message-utils'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { onDiscordMessage } from './nodes/events/onDiscordMessage'

export class DiscordPlugin extends WebSocketPlugin<
  typeof DISCORD_EVENTS,
  typeof DISCORD_ACTIONS,
  typeof DISCORD_DEPENDENCIES,
  typeof DISCORD_COMMANDS,
  DiscordCredentials,
  DiscordEvent,
  Record<string, unknown>,
  Record<string, unknown>,
  DiscordPluginState
> {
  override defaultState = discordDefaultState
  discord = new Client({ intents: discordIntents })
  utils = new DiscordMessageUtils(this.agentId)
  nodes = [onDiscordMessage, sendDiscordMessage]
  values = []

  constructor(init: BasePluginInit) {
    super({ ...init, name: discordPluginName })
  }

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

  // ACTIONS
  getActionHandlers() {
    return {
      [DISCORD_ACTIONS.sendMessage]: this.handleSendMessage.bind(this),
    }
  }

  handleSendMessage<K extends keyof DiscordEventPayload>(
    actionPayload: ActionPayload<DiscordEventPayload[K]>
  ) {
    const { event } = actionPayload
    const { plugin } = event
    if (plugin === discordPluginName) {
      this.sendMessage(actionPayload.data.content, event as DiscordEvent)
    }
  }

  // DEPENDENCIES
  async getDependencies() {
    return {
      [DISCORD_DEPENDENCIES.DISCORD_KEY]: this.discord,
      [DISCORD_DEPENDENCIES.DISCORD_SEND_MESSAGE]: this.sendMessage.bind(this),
      [DISCORD_DEPENDENCIES.DISCORD_CONTEXT]: this.getContext.bind(this),
    }
  }

  sendMessage: SendMessage = async (content, event) => {
    if (!event.data.channelId) {
      throw new Error('No channel id found')
    }

    try {
      const channel = await this.discord.channels.fetch(event.data.channelId)
      if (!channel || channel.type !== ChannelType.GuildText) {
        throw new Error('Invalid channel')
      }

      const MAX_LENGTH = 2000
      const sentences = this.utils.tokenizeIntoSentences(content)
      let currentBatch = ''
      const batches = [] as string[]

      for (const sentence of sentences) {
        if (sentence.length > MAX_LENGTH) {
          const parts = this.utils.splitLongSentence(sentence, MAX_LENGTH)
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
      this.logger.error(err, 'Error sending Discord message')
      throw err
    }
  }

  // COMMANDS
  getCommandHandlers() {
    return {}
  }

  // LIFE CYCLE
  async login(credentials: DiscordCredentials) {
    await this.discord.login(credentials['discord-token'])
    this.logger.info('Logged in to Discord')
  }

  validateLogin() {
    return this.discord.user !== null
  }

  validatePermissions() {
    // TODO: Implement permission validation
    return true
  }

  validateCredentials(credentials: DiscordCredentials) {
    console.log()
    if (!credentials?.['discord-token']) {
      return false
    }
    return credentials
  }

  async logout() {
    this.unlistenAll()
    await this.discord.destroy()
    this.logger.info('Logged out of Discord')
  }

  listen(eventName: keyof DiscordEventPayload) {
    this.discord.on(eventName, (...args) => {
      const payload = args[0] as DiscordEventPayload[typeof eventName]
      if (this.utils.checkIfBotMessage(payload)) {
        return
      }
      this.eventManager.emitEvent(
        eventName,
        this.utils.createEventPayload(eventName, payload, this.getContext())
      )
    })
  }

  unlisten(eventName: keyof DiscordEventPayload) {
    this.discord.removeAllListeners(eventName)
  }

  getContext() {
    const orString = (str: string | null | undefined) => str ?? ''
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

  formatPayload(event, payload) {
    return payload
  }
}
