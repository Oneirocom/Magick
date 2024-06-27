import { type BasePluginInit } from '@magickml/agent-plugin'
import { type CorePluginEvents } from 'plugins/core'
import { EventPayload, ActionPayload } from '@magickml/shared-services'
import {
  ChannelType,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  TextChannel,
} from 'discord.js'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { WebSocketPlugin } from '@magickml/agent-plugin'
import { DiscordMessageUtils } from './services/discord-message-utils'
import { isDiscordToken } from '@magickml/token-validation'

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
  EMBED_COLOR,
  EDITS_PER_SECOND,
  EMBED_MAX_LENGTH,
} from './configx'
import { SEND_MESSAGE, STREAM_MESSAGE } from '@magickml/agent-communication'
// import { streamDiscordMessage } from './nodes/actions/streamDiscordMessage'

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
  nodes = [
    ...onDiscordMessageNodes,
    sendDiscordMessage,
    // streamDiscordMessage
  ]
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

  constructor({ connection, agent, projectId }: BasePluginInit) {
    super({ name: discordPluginName, connection, agent, projectId })
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
      [DISCORD_DEPENDENCIES.DISCORD_STREAM_MESSAGE]:
        this.streamMessage.bind(this),
      [DISCORD_DEPENDENCIES.DISCORD_CONTEXT]: this.getContext.bind(this),
    }
  }

  // ACTIONS
  /**
   * Here we are handling the generic events that come from the core magick plugin
   * and mapping them to the specific actions that we want to take in the discord plugin.
   * We can also handle other actionshere.  These are listened for on the event bus.
   */
  getActionHandlers() {
    return {
      [DISCORD_ACTIONS[SEND_MESSAGE]]: this.handleSendMessage.bind(this),
      [DISCORD_ACTIONS[STREAM_MESSAGE]]: this.handleSendMessage.bind(this),
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

    this.sendMessage(actionPayload.data.content, event)
  }

  // OTHER ABSTRACTS FROM WS PLUGIN & BASE PLUGIN
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
        const payload = args[0] as any

        if (this.utils.checkIfBotMessage(payload)) {
          return
        }

        if (eventName === 'messageCreate') {
          const attachments = payload.attachments.map((attachment: any) =>
            attachment.toJSON()
          )

          this.triggerMessageReceived(
            this.utils.createEventPayload<typeof eventName>(
              eventName,
              payload.toJSON() as DiscordEventPayload[typeof eventName],
              this.getContext(),
              {
                attachments,
              }
            )
          )
        }

        this.emitEvent(
          eventName,
          this.utils.createEventPayload<typeof eventName>(
            eventName,
            payload.toJSON(),
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

  streamMessage: SendMessage = async (content, event) => {
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

      let responseMessage = await (channel as TextChannel).send({
        embeds: [
          new EmbedBuilder()
            .setDescription('⏳')
            .setColor(EMBED_COLOR.incomplete),
        ],
      })

      let responseContent = ''
      let lastTaskTime = Date.now()

      for await (const chunk of content.split(/(?<=\S)\s+/g)) {
        responseContent += chunk

        const isFinalEdit = responseContent.length >= content.length
        const shouldEdit =
          isFinalEdit || Date.now() - lastTaskTime >= 1000 / EDITS_PER_SECOND

        if (shouldEdit) {
          const embed = new EmbedBuilder()
            .setDescription(responseContent.slice(0, EMBED_MAX_LENGTH))
            .setColor(
              isFinalEdit ? EMBED_COLOR.complete : EMBED_COLOR.incomplete
            )

          await responseMessage.edit({ embeds: [embed] })
          lastTaskTime = Date.now()

          if (responseContent.length > EMBED_MAX_LENGTH) {
            responseContent = responseContent.slice(EMBED_MAX_LENGTH)
            responseMessage = await (channel as TextChannel).send({
              embeds: [
                new EmbedBuilder()
                  .setDescription(responseContent.slice(0, EMBED_MAX_LENGTH))
                  .setColor(EMBED_COLOR.incomplete),
              ],
            })
          }
        }
      }

      // Send the final message if there's any remaining content
      if (responseContent.length > 0) {
        const embed = new EmbedBuilder()
          .setDescription(responseContent)
          .setColor(EMBED_COLOR.complete)

        await (channel as TextChannel).send({ embeds: [embed] })
      }
    } catch (err) {
      this.logger.error(err, 'ERROR IN DISCORD STREAM MESSAGE')
      throw err
    }
  }

  formatPayload(events: any, payload: any) {
    return payload
  }
}
