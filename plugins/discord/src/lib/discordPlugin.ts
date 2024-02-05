import { ActionPayload, CoreEventsPlugin } from 'server/plugin'
import {
  DISCORD_KEY,
  DISCORD_EVENTS,
  discordPluginCredentials,
} from './constants'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { discordPluginName } from './constants'
import { DiscordClient } from './services/discord'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { DiscordCredentials, DiscordEventPayload } from './types'
import { EventTypes } from 'communication'

export class DiscordPlugin extends CoreEventsPlugin {
  override enabled = true
  nodes = [...onDiscordMessageNodes, sendDiscordMessage]
  values = []
  discord: DiscordClient | undefined = undefined

  constructor({ connection, agentId, projectId }) {
    super({ name: discordPluginName, connection, agentId, projectId })
    this.setCredentials(discordPluginCredentials)
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

      this.logger.info('Discord client initialized.')
    } catch (error) {
      this.logger.error(error, 'Failed during initialization:')
      throw error
    }
  }

  async initializeFunctionalities() {
    await this.initalizeDiscord().catch(error =>
      this.logger.error(
        `Failed to initialize Discord Plugin for agent ${this.agentId} ${error}`
      )
    )
    // // handle generic message received event from discord
    this.discord?.onMessageCreate(event => {
      // todo fix typing here,but I am lazy.
      this.triggerMessageReceived(event as any)
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
    // for (const [actionName] of Object.entries(DISCORD_ACTIONS)) {
    //   this.registerAction({
    //     actionName,
    //     displayName: `Discord ${actionName}`,
    //     handler: this.handleSendMessage.bind(this),
    //   })
    // }
    // Handler for generic event if it comes in
    this.registerAction({
      actionName: EventTypes.SEND_MESSAGE,
      displayName: 'Send Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  getDependencies() {
    return {
      [discordPluginName]: DiscordEmitter,
      [DISCORD_KEY]: this.discord,
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

  handleOnMessage() {}

  handleSendMessage<K extends keyof DiscordEventPayload>(
    actionPayload: ActionPayload<DiscordEventPayload[K]>
  ) {
    const { event, data } = actionPayload
    this.discord?.sendMessage<K>(data.content, event)
  }

  formatPayload(event, payload) {
    return payload
  }
}
