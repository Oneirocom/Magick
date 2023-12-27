import Redis from 'ioredis'
import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import { Job } from 'bullmq'
import {
  ActionPayload,
  CoreEventsPlugin,
  EventPayload,
  WebhookEvent,
} from 'packages/server/plugin/src'
import { DISCORD_MESSAGES } from './constants'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { DiscordActionService } from './services/discordActionService'
import DiscordEventClient from './services/discordEventClient'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { discordMessageEvent } from './nodes/events/discordMessageEvent'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { SpellCaster } from 'packages/server/grimoire/src'
import { pluginName, pluginCredentials } from './constants'
import { DiscordClient } from './services/discordClient'
import { DiscordCredentials } from './types'

export class DiscordPlugin extends CoreEventsPlugin {
  override enabled = true
  event: DiscordEventClient
  nodes = [discordMessageEvent, sendDiscordMessage]
  values = []
  webhookEvents?: WebhookEvent[] | undefined
  discord: DiscordClient | undefined = undefined

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId)
    this.event = new DiscordEventClient(pubSub, agentId)
    this.meterManager.initializeMeters({})
    this.setCredentials(pluginCredentials)
    this.initalizeDiscord().catch(error =>
      this.logger.error(
        `Failed to initialize Discord Plugin for agent ${agentId}`
      )
    )
  }

  override initializeFunctionalities(): void {
    this.centralEventBus.on(
      DISCORD_MESSAGES.messageCreate,
      this.handleOnMessage.bind(this)
    )
    this.event.onMessage(this.handleOnMessage.bind(this))
  }

  defineEvents(): void {
    this.registerEvent({
      eventName: DISCORD_MESSAGES.messageCreate,
      displayName: 'Discord Message Received',
    })
  }

  defineActions(): void {
    this.registerAction({
      actionName: 'sendDiscordMessage',
      displayName: 'Send Discord Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  getDependencies(spellCaster: SpellCaster) {
    return {
      [pluginName]: DiscordEmitter,
      discordActionService: new DiscordActionService(
        this.connection,
        this.actionQueueName
      ),
    }
  }

  override provideRegistry(registry: IRegistry): IRegistry {
    return registerCoreProfile(registry)
  }

  async initalizeDiscord() {
    try {
      const credentials = await this.getCredentials()
      this.discord = new DiscordClient(
        credentials,
        this.agentId,
        this.emitEvent.bind(this)
      )

      await this.discord.init()

      this.updateDependency('discordClient', this.discord)
    } catch (error) {
      console.error('Failed during initialization:', error)
    }
  }

  handleOnMessage(payload: EventPayload) {
    this.logger.debug('Received message:', payload)
    console.log('Received message:', payload)
    const event = this.formatMessageEvent(DISCORD_MESSAGES.message, payload)
    this.emitEvent(DISCORD_MESSAGES.message, event)
  }

  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`

    if (plugin === 'Discord') {
      this.event.sendMessage(actionPayload.data)
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data)
    }
  }

  formatPayload(event, payload) {
    return payload
  }

  async getCredentials(): Promise<DiscordCredentials> {
    try {
      const token = await this.credentialsManager.retrieveAgentCredentials(
        this.agentId,
        'discord-token'
      )
      return { token }
    } catch (error) {
      console.error('Failed to retrieve credentials:', error)
      throw error
    }
  }
}
