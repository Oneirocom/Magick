import Redis from 'ioredis'
import { ActionPayload, EventPayload } from 'server/plugin'
import { SlackEmitter } from './dependencies/slackEmitter'
import SlackEventClient from './services/slackEventClient'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import {
  sendSlackImage,
  sendSlackMessage,
  onSlackMessageNodes,
  sendSlackAudio,
} from './nodes'
import { WebSocketPlugin } from 'server/plugin'
import { type CorePluginEvents } from 'plugin/core'
import {
  type AllMiddlewareArgs,
  type MessageEvent,
  type SlackEventMiddlewareArgs,
  App,
} from '@slack/bolt'

import {
  SLACK_DEPENDENCIES,
  SLACK_COMMANDS,
  SLACK_ACTIONS,
  SLACK_EVENTS,
  slackPluginName,
  slackPluginCredentials,
  slackDefaultState,
  type SlackCredentials,
  type SlackPluginState,
  SLACK_DEVELOPER_MODE,
  SlackEventPayload,
  SlackEvents,
  SlackMessageEvents,
  SlackBaseMessageEvent,
  SendSlackMessage,
} from './configx'
import { SLACK_DEP_KEYS } from './config'

export class SlackPlugin extends WebSocketPlugin<
  typeof SLACK_EVENTS,
  typeof SLACK_ACTIONS,
  typeof SLACK_DEPENDENCIES,
  typeof SLACK_COMMANDS,
  SlackCredentials,
  CorePluginEvents,
  EventPayload<SlackEventPayload[keyof SlackEventPayload], any>,
  Record<string, unknown>,
  Record<string, unknown>,
  SlackPluginState
> {
  override defaultState = slackDefaultState
  client: SlackEventClient
  nodes = [
    ...onSlackMessageNodes,
    sendSlackMessage,
    sendSlackImage,
    sendSlackAudio,
  ]
  values = []
  slack: App | null = null
  credentials = slackPluginCredentials

  constructor({
    connection,
    agentId,
    pubSub,
    projectId,
  }: {
    connection: Redis
    agentId: string
    pubSub: RedisPubSub
    projectId: string
  }) {
    super({ name: slackPluginName, connection, agentId, projectId })
    this.client = new SlackEventClient(pubSub, agentId)
  }

  getPluginConfig() {
    return {
      events: SLACK_EVENTS,
      actions: SLACK_ACTIONS,
      dependencyKeys: SLACK_DEPENDENCIES,
      commands: SLACK_COMMANDS,
      developerMode: SLACK_DEVELOPER_MODE,
      credentials: slackPluginCredentials,
    }
  }

  // COMMANDS
  getCommandHandlers() {
    return {}
  }

  async login(credentials: SlackCredentials) {
    this.slack = new App({
      token: credentials['slack-token'],
      signingSecret: credentials['slack-signing-secret'],
      socketMode: true,
      appToken: credentials['slack-app-token'],
      developerMode: SLACK_DEVELOPER_MODE,
    })
    await this.slack.start()
  }

  async validateLogin() {
    if (!this.slack) {
      this.logger.warn('Slack client not initialized on validateLogin')
      return false
    }
    const test = await this.slack.client.auth.test()
    return test.ok
  }

  validatePermissions() {
    // TODO
    return true
  }

  async logout() {
    if (!this.slack) {
      this.logger.warn('Slack client not initialized on logout')
      return
    }

    // Stop the Slack app
    await this.slack.stop()

    this.slack.client.removeAllListeners()

    // Nullify the Slack app instance to ensure it's completely dereferenced
    this.slack = null

    this.logger.info('Logged out of Slack and the Slack client destroyed')
  }

  async getContext() {
    if (!this.slack) {
      throw new Error('Slack client not initialized')
    }
    const orString = (str: string | null | undefined) => (str ? str : '')
    const ctx = await this.slack.client.auth.test()
    return {
      id: orString(ctx.user_id),
      username: orString(ctx.user),
      platform: slackPluginName,
      authTest: ctx,
    }
  }

  validateCredentials(credentials: SlackCredentials) {
    if (
      !credentials['slack-token'] ||
      !credentials['slack-signing-secret'] ||
      !credentials['slack-app-token']
    ) {
      this.logger.warn(
        `Missing required Slack credentials: ${[
          'token',
          'signingSecret',
          'appToken',
        ]
          .filter(key => !credentials[key])
          .join(', ')}`
      )
      return false
    }
    return credentials
  }

  private createMessageEventPayload(
    message: MessageEvent,
    messageType: string
  ): SlackEventPayload {
    const payload: SlackEventPayload = {
      connector: 'slack',
      eventName: messageType,
      status: 'success',
      content: '',
      sender: '',
      observer: 'assistant',
      client: 'cloud.magickml.com',
      channel: message.channel,
      plugin: 'slack',
      agentId: this.agentId,
      channelType: message.channel_type,
      rawData: message,
      timestamp: new Date().toISOString(),
      data: message,
      metadata: {
        context: this.stateManager.getState()?.context,
      },
    }

    // TODO: fix typing so we don't have to do this
    if ('text' in message) {
      payload.content = message.text || ''
    }
    if ('user' in message) {
      payload.sender = message.user || ''
    }

    return payload
  }

  listen(eventName: SlackEvents) {
    if (!this.slack) {
      this.logger.warn('Slack client not initialized')
      return
    }
    this.slack.event(
      eventName,
      async (
        args: SlackEventMiddlewareArgs<typeof eventName> & AllMiddlewareArgs
      ) => {
        if (args.event.type === 'message') {
          const message = args.event as
            | SlackMessageEvents[keyof SlackMessageEvents]
            | SlackBaseMessageEvent

          const eventPayload = this.createMessageEventPayload(
            args.event,
            message.subtype || 'message'
          )

          this.emitEvent(message.subtype || 'message', eventPayload)
        }
      }
    )
  }

  unlisten(eventName: SlackEvents) {
    if (!this.slack) {
      this.logger.warn('Slack client not initialized')
      return
    }
    this.slack.event(eventName, async () => {})
  }

  // ACTIONS
  getActionHandlers() {
    return {
      [SLACK_ACTIONS.sendMessage]: this.handleSendMessage.bind(this),
    }
  }

  getDependencies() {
    return {
      [slackPluginName]: SlackEmitter,
      [SLACK_DEP_KEYS.SLACK_KEY]: this.slack,
      [SLACK_DEP_KEYS.SEND_SLACK_MESSAGE]: this.sendSlackMessage.bind(this),
    }
  }

  sendSlackMessage: SendSlackMessage = async (content, channel) => {
    if (!this.slack) {
      this.logger.warn(
        'Slack client not initialized but sendSlackMessage invoked'
      )
      return
    }

    await this.slack.client.chat.postMessage({
      text: content,
      channel: channel,
    })
  }

  handleSendMessage<K extends keyof SlackEventPayload>(
    actionPayload: ActionPayload<SlackEventPayload[K]>
  ) {
    const { event } = actionPayload
    const { plugin } = event
    if (plugin === slackPluginName) {
      // this.client.sendMessage(actionPayload)
    } else {
      this.centralEventBus.emit('createMessage', actionPayload)
    }
  }

  formatPayload(event, payload) {
    return payload
  }
}
