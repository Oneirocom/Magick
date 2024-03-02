import {
  ActionPayload,
  BasePluginInit,
  CoreEventsPluginWithDefaultTypes,
} from 'server/plugin'
import {
  DISCORD_KEY,
  DISCORD_EVENTS,
  discordPluginCredentials,
  discordDefaultState,
  discordPluginName,
  discordPluginCommands,
  type DiscordCredentials,
  type DiscordEventPayload,
  type DiscordPluginState,
} from './config'
import { DiscordEmitter } from './dependencies/discordEmitter'
import { sendDiscordMessage } from './nodes/actions/sendDiscordMessage'
import { DiscordClient } from './services/discord'
import { onDiscordMessageNodes } from './nodes/events/onDiscordMessage'
import { EventTypes } from 'communication'

export class DiscordPlugin extends CoreEventsPluginWithDefaultTypes<
  DiscordPluginState,
  DiscordCredentials
> {
  override defaultState = discordDefaultState
  nodes = [...onDiscordMessageNodes, sendDiscordMessage]
  values = []
  credentials = discordPluginCredentials
  discord: DiscordClient
  state = []

  constructor({ connection, agentId, projectId }: BasePluginInit) {
    super({ name: discordPluginName, connection, agentId, projectId })
    this.discord = new DiscordClient(
      this.agentId,
      this.emitEvent.bind(this),
      this.logger
    )
  }

  async handleEnable() {
    await this.updatePluginState({ enabled: true })
    await this.initializeFunctionalities()
    await this.refreshContext()
    this.logger.debug('Discord plugin enabled')
  }

  async handleDisable() {
    await this.updatePluginState({ enabled: false })
    await this.discord?.logout()
    this.logger.debug('Discord plugin disabled')
  }

  async refreshContext() {
    const context = this.discord?.getClient().user
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

    if (state?.enabled) {
      console.log('Discord plugin is enabled')
      await this.updateCredentials()

      const creds = await this.getCredentials()
      if (!creds?.['discord-token']) {
        this.logger.error('No discord token found')
        return
      }

      await this.discord.login(creds['discord-token'])

      this.discord.setupAllEventListeners()

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
    // Handler for generic event if it comes in
    this.registerAction({
      actionName: EventTypes.SEND_MESSAGE,
      displayName: 'Send Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  async getDependencies() {
    return {
      [discordPluginName]: DiscordEmitter,
      [DISCORD_KEY]: this.discord,
    }
  }

  handleOnMessage() {}

  handleSendMessage<K extends keyof DiscordEventPayload>(
    actionPayload: ActionPayload<DiscordEventPayload[K]>
  ) {
    const { event, data } = actionPayload
    this.discord?.sendMessage<K>(data.content, event)
  }

  formatPayload(event: any, payload: any) {
    return payload
  }
}
