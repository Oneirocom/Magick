import Redis from 'ioredis'
import { Job } from 'bullmq'
import { ActionPayload, CoreEventsPlugin } from 'packages/server/plugin/src'
import {
  DISCORD_ACTIONS,
  DISCORD_KEY,
  DISCORD_EVENTS,
  discordPluginCredentials,
} from './constants'
import { DiscordEmitter } from './dependencies/discordEmitter'
import DiscordEventClient from './services/discordEventClient'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { discordPluginName } from './constants'
import { DiscordClient } from './services/discord'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { DiscordCredentials } from './types'

export class DiscordPlugin extends CoreEventsPlugin {
  override enabled = true
  event: DiscordEventClient
  nodes = [...onDiscordMessageNodes, sendDiscordMessage]
  values = []
  discord: DiscordClient | undefined = undefined

  constructor(
    connection: Redis,
    agentId: string,
    pubSub: RedisPubSub,
    projectId: string
  ) {
    super(discordPluginName, connection, agentId, projectId)
    this.event = new DiscordEventClient(pubSub, agentId)
    this.setCredentials(discordPluginCredentials)
    this.initalizeDiscord().catch(error =>
      this.logger.error(
        `Failed to initialize Discord Plugin for agent ${agentId} ${error}`
      )
    )
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
    for (const [actionName] of Object.entries(DISCORD_ACTIONS)) {
      this.registerAction({
        actionName,
        displayName: `Discord ${actionName}`,
        handler: this.handleSendMessage.bind(this),
      })
    }
  }

  getDependencies() {
    return {
      [discordPluginName]: DiscordEmitter,
      [DISCORD_KEY]: this.discord,
    }
  }

  async initalizeDiscord() {
    try {
      const credentials = await this.getCredentials()

      console.log('setting up discord client on agent', this.agentId)
      this.discord = new DiscordClient(
        credentials,
        this.agentId,
        this.emitEvent.bind(this),
        this.logger
      )

      await this.discord.init()

      this.updateDependency('discordClient', this.discord)
    } catch (error) {
      this.logger.error('Failed during initialization:', error)
    }
  }

  private async getCredentials(): Promise<DiscordCredentials> {
    try {
      const tokens = Object.values(discordPluginCredentials).map(c => c.name)
      const [token] = await Promise.all(
        tokens.map(t =>
          this.credentialsManager.retrieveAgentCredentials(this.agentId, t)
        )
      )

      return token
    } catch (error) {
      this.logger.error('Failed to retrieve credentials:', error)
      throw error
    }
  }

  initializeFunctionalities(): void {}
  handleOnMessage() {}
  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`
    console.log(
      'sending message from discord plugin',
      plugin,
      eventName,
      actionName,
      event
    )

    if (plugin === 'Discord') {
      this.event.sendMessage(actionPayload.data)
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data)
    }
  }

  formatPayload(event, payload) {
    return payload
  }
}
