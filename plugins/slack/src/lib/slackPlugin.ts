import Redis from 'ioredis'
import { Job } from 'bullmq'
import { ActionPayload, CoreEventsPluginWithDefaultTypes } from 'server/plugin'
import {
  SLACK_ACTIONS,
  SLACK_EVENTS,
  SLACK_KEY,
  slackPluginName,
  slackPluginCommands,
  slackPluginCredentials,
  slackDefaultState,
  type SlackCredentials,
  type SlackPluginState,
} from './config'
import { SlackEmitter } from './dependencies/slackEmitter'
import SlackEventClient from './services/slackEventClient'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { SlackClient } from './services/slack'
import {
  sendSlackImage,
  sendSlackMessage,
  onSlackMessageNodes,
  sendSlackAudio,
} from './nodes'

export class DiscordPlugin extends CoreEventsPluginWithDefaultTypes<
  SlackPluginState,
  SlackCredentials
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
  slack: SlackClient | undefined = undefined
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

  defineCommands() {
    for (const [commandName, commandInfo] of Object.entries(
      slackPluginCommands
    )) {
      this.registerCommand({
        commandName,
        displayName: commandInfo.displayName,
        handler: thing => console.log(`Handling ${commandName} with ${thing}`),
      })
    }
  }

  defineEvents(): void {
    for (const [messageType, eventName] of Object.entries(SLACK_EVENTS)) {
      this.registerEvent({
        eventName,
        displayName: `Slack ${messageType}`,
      })
    }
  }

  defineActions(): void {
    for (const [actionName] of Object.entries(SLACK_ACTIONS)) {
      this.registerAction({
        actionName,
        displayName: `Slack ${actionName}`,
        handler: this.handleSendMessage.bind(this),
      })
    }
  }

  getDependencies() {
    return {
      [slackPluginName]: SlackEmitter,
      [SLACK_KEY]: this.slack,
    }
  }

  private async initalizeSlack() {
    try {
      await this.updateCredentials()
      const credentials = await this.getCredentials()
      // validate each three keys
      if (
        !credentials ||
        !credentials['slack-token'] ||
        !credentials['slack-signing-secret'] ||
        !credentials['slack-app-token']
      ) {
        return
      }

      this.slack = new SlackClient(
        credentials,
        this.agentId,
        this.emitEvent.bind(this)
      )

      await this.slack.init()

      this.updateDependency(SLACK_KEY, this.slack)
    } catch (error) {
      this.logger.error(error, 'Failed during initialization:')
    }
  }

  async initializeFunctionalities(): Promise<void> {
    await this.initalizeSlack()
  }
  handleOnMessage() {}

  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`

    if (plugin === slackPluginName) {
      this.client.sendMessage(actionPayload.data)
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data)
    }
  }

  formatPayload(event, payload) {
    return payload
  }
}
