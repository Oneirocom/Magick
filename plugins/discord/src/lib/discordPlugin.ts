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
  discordPluginCommands,
  type DiscordCredentials,
  type DiscordEventPayload,
  type DiscordPluginState,
  SendMessage,
} from './config'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { EventTypes } from 'communication'
import { AbstractWebsocketPlugin } from 'plugin-abstracts'
import { DiscordMessageUtils } from './services/discord-message-utils'

export class DiscordPlugin extends AbstractWebsocketPlugin<
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

  async login(credentials: DiscordCredentials) {
    this.logger.info('Initializing Discord client...')
    await this.discord.login(credentials['discord-token'])
  }

  public async logout() {
    this.discord.removeAllListeners()
    await this.discord.destroy()
  }

  async handleEnable() {
    await this.updatePluginState({ enabled: true })
    await this.initializeFunctionalities()
    await this.refreshContext()
    this.logger.debug('Discord plugin enabled')
  }

  async handleDisable() {
    await this.updatePluginState({ enabled: false })
    await this.logout()
    this.logger.debug('Discord plugin disabled')
  }

  async refreshContext() {
    const context = this.discord.user
    if (context) {
      await this.updatePluginState({
        context: {
          id: context.id,
          username: context.username,
          displayName: context.username,
          avatar: context.avatar,
          banner: context.banner,
        },
      })
    }
  }

  async initializeFunctionalities() {
    const state = await this.stateManager.getPluginState()
    await this.updateCredentials()

    if (state?.enabled) {
      this.logger.debug('Discord plugin is enabled')
      const creds = await this.getCredentials()
      if (!creds?.['discord-token']) {
        this.logger.error('No discord token found')
        return
      }

      await this.discord.login(creds['discord-token'])
      this.discord.removeAllListeners()
      this.setupAllEventListeners()

      // handle generic message received event from discord
      // this.discord?.onMessageCreate(event => {
      //   console.log('onMessageCreate', event)
      //   // todo fix typing here,but I am lazy.
      //   this.triggerMessageReceived(event as any)
      // })
    } else {
      this.logger.debug('Discord plugin is not enabled')
    }
  }

  setupEventListener(eventName: keyof DiscordEventPayload) {
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
          this.utils.createEventPayload<typeof eventName>(eventName, payload)
        )
      }
    )
  }

  setupAllEventListeners() {
    Object.keys(DISCORD_EVENTS).forEach(eventName => {
      this.setupEventListener(eventName as keyof DiscordEventPayload)
    })
  }

  defineCommands() {
    const { enable, disable, linkCredential, unlinkCredential } =
      discordPluginCommands
    this.registerCommand({
      ...linkCredential,
      handler: this.handleEnable.bind(this),
    })
    this.registerCommand({
      ...unlinkCredential,
      handler: this.handleDisable.bind(this),
    })
    this.registerCommand({
      ...enable,
      handler: this.handleEnable.bind(this),
    })
    this.registerCommand({
      ...disable,
      handler: this.handleDisable.bind(this),
    })
  }

  defineEvents(): void {
    for (const [messageType, eventName] of Object.entries(DISCORD_EVENTS)) {
      this.registerEvent({
        eventName,
        displayName: `Discord ${messageType}`,
      })
    }
  }

  defineActions(): void {
    this.registerAction({
      actionName: EventTypes.SEND_MESSAGE,
      displayName: 'Send Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  async getDependencies() {
    return {
      [discordPluginName]: DiscordEmitter,
      [DISCORD_DEP_KEYS.DISCORD_KEY]: this.discord,
      [DISCORD_DEP_KEYS.DISCORD_SEND_MESSAGE]: this.sendMessage.bind(this),
    }
  }

  handleOnMessage() {}

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
        payload
      )
      handler(eventPayload)
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
