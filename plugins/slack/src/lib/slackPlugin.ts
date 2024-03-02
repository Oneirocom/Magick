import Redis from 'ioredis'
import { Job } from 'bullmq'
import { ActionPayload, CoreEventsPlugin, EventPayload } from 'server/plugin'
import { SLACK_ACTIONS, SLACK_EVENTS, SLACK_KEY } from './constants'
import { SlackEmitter } from './dependencies/slackEmitter'
import SlackEventClient from './services/slackEventClient'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import {
  slackPluginName,
  pluginCredentials,
  slackDefaultState,
} from './constants'
import { SlackClient } from './services/slack'
import { type SlackCredentials, type SlackPluginState } from './types'
import {
  sendSlackImage,
  sendSlackMessage,
  onSlackMessageNodes,
  sendSlackAudio,
} from './nodes'
import { CorePluginEvents } from 'plugin/core'
import { corePluginCommands } from 'plugins/core/src/lib/commands'

export class SlackPlugin extends CoreEventsPlugin<
  CorePluginEvents,
  EventPayload,
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
  slack: SlackClient | undefined = undefined
  credentials = pluginCredentials

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
      corePluginCommands
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
      // // const credentials = (await this.getCredentials()) as SlackCredentials
      
      // this.slack = new SlackClient(
      //   credentials,
      //   this.agentId,
      //   this.emitEvent.bind(this)
      // )

      // await this.slack.init()

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
