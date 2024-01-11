import Redis from 'ioredis'
import { Job } from 'bullmq'
import {
  ActionPayload,
  CoreEventsPlugin,
  // WebhookEvent,
} from 'packages/server/plugin/src'
import { SLACK_ACTIONS, SLACK_EVENTS, SLACK_KEY } from './constants'
import { SlackEmitter } from './dependencies/slackEmitter'
import SlackEventClient from './services/slackEventClient'
import { sendSlackMessage } from './nodes/actions/sendSlackMessage'
import { slackMessageEvent } from './nodes/events/slackMessageEvent'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { pluginName, pluginCredentials } from './constants'
import { SlackClient } from './services/slack'
import { SlackCredentials } from './types'
import { sendSlackImage } from './nodes/actions/sendSlackImage'
import LCMCLient from './services/lcmClient'
import { generateImage } from './nodes/actions/generateImage'
import { getCredentials } from './nodes/temp/credentials'
import { sendSlackMessageV2 } from './nodes/actions/sendSlackImageV2'
import { generateImageV2 } from './nodes/temp/generateImageV2'
import { generateSpeech } from './nodes/temp/generateSpeech'
import { sendSlackAudio } from './nodes/actions/sendSlackAudio'

export class SlackPlugin extends CoreEventsPlugin {
  override enabled = true
  event: SlackEventClient
  nodes = [
    slackMessageEvent,
    sendSlackMessage,
    sendSlackImage,
    sendSlackMessageV2,
    generateImage,
    generateImageV2,
    getCredentials,
    generateSpeech,
    sendSlackAudio,
  ]
  values = []
  // webhookEvents?: WebhookEvent[] | undefined
  slack: SlackClient | undefined = undefined
  lcmClient = new LCMCLient('http://34.48.65.58:5000/predictions', this.agentId)

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId)
    this.event = new SlackEventClient(pubSub, agentId)
    // this.meterManager.initializeMeters({})
    this.setCredentials(pluginCredentials)
    this.initalizeSlack().catch(error =>
      this.logger.error(
        `Failed to initialize Slack Plugin for agent ${agentId}`
      )
    )
  }

  defineEvents(): void {
    for (const [messageType, eventName] of Object.entries(SLACK_EVENTS)) {
      console.log('registering event', eventName)
      this.registerEvent({
        eventName,
        displayName: `Slack ${messageType}`,
      })
    }
  }

  defineActions(): void {
    for (const [actionName] of Object.entries(SLACK_ACTIONS)) {
      console.log('registering action', actionName)
      this.registerAction({
        actionName,
        displayName: `Slack ${actionName}`,
        handler: this.handleSendMessage.bind(this),
      })
    }
  }

  getDependencies() {
    return {
      [pluginName]: SlackEmitter,
      lcmClient: this.lcmClient,
      slackClient: this.slack,
      credentialsManager: this.credentialsManager,
    }
  }

  private async initalizeSlack() {
    try {
      const credentials = await this.getCredentials()
      this.slack = new SlackClient(
        credentials,
        this.agentId,
        this.emitEvent.bind(this)
      )

      await this.slack.init()

      this.updateDependency(SLACK_KEY, this.slack)
    } catch (error) {
      console.error('Failed during initialization:', error)
    }
  }

  private async getCredentials(): Promise<SlackCredentials> {
    try {
      const tokens = ['slack-token', 'slack-signing-secret', 'slack-app-token']
      const [token, signingSecret, appToken] = await Promise.all(
        tokens.map(t =>
          this.credentialsManager.retrieveAgentCredentials(this.agentId, t)
        )
      )
      return { token, signingSecret, appToken }
    } catch (error) {
      console.error('Failed to retrieve credentials:', error)
      throw error
    }
  }

  initializeFunctionalities(): void {}
  handleOnMessage() {}
  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`

    if (plugin === 'Slack') {
      this.event.sendMessage(actionPayload.data)
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data)
    }
  }

  formatPayload(event, payload) {
    return payload
  }
}
