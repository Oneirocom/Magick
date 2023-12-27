import Redis from 'ioredis'
import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import { Job } from 'bullmq'
import {
  ActionPayload,
  CoreEventsPlugin,
  EventPayload,
  WebhookEvent,
} from 'packages/server/plugin/src'
import { SLACK_MESSAGES } from './constants'
import { SlackEmitter } from './dependencies/slackEmitter'
import { SlackActionService } from './services/slackActionService'
import SlackEventClient from './services/slackEventClient'
import { sendSlackMessage } from './nodes/actions/sendSlackMessage'
import { slackMessageEvent } from './nodes/events/slackMessageEvent'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { SpellCaster } from 'packages/server/grimoire/src'
import { pluginName, pluginCredentials } from './constants'
import { SlackClient } from './services/slackClient'
import { SlackCredentials } from './types'
import { sendSlackImage } from './nodes/actions/sendSlackImage'

export class SlackPlugin extends CoreEventsPlugin {
  override enabled = true
  event: SlackEventClient
  nodes = [slackMessageEvent, sendSlackMessage, sendSlackImage]
  values = []
  webhookEvents?: WebhookEvent[] | undefined
  slack: SlackClient | undefined = undefined

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId)
    this.event = new SlackEventClient(pubSub, agentId)
    this.meterManager.initializeMeters({})
    this.setCredentials(pluginCredentials)
    this.initalizeSlack().catch(error =>
      this.logger.error(
        `Failed to initialize Slack Plugin for agent ${agentId}`
      )
    )
  }

  override initializeFunctionalities(): void {
    this.centralEventBus.on(
      SLACK_MESSAGES.message,
      this.handleOnMessage.bind(this)
    )
    this.event.onMessage(this.handleOnMessage.bind(this))
  }

  defineEvents(): void {
    this.registerEvent({
      eventName: SLACK_MESSAGES.message,
      displayName: 'Slack Message Received',
    })
  }

  defineActions(): void {
    this.registerAction({
      actionName: 'sendSlackMessage',
      displayName: 'Send Slack Message',
      handler: this.handleSendMessage.bind(this),
    })
  }

  getDependencies(spellCaster: SpellCaster) {
    return {
      [pluginName]: SlackEmitter,
      slackActionService: new SlackActionService(
        this.connection,
        this.actionQueueName
      ),
    }
  }

  override provideRegistry(registry: IRegistry): IRegistry {
    return registerCoreProfile(registry)
  }

  async initalizeSlack() {
    try {
      const credentials = await this.getCredentials()
      this.slack = new SlackClient(
        credentials,
        this.agentId,
        this.emitEvent.bind(this)
      )

      await this.slack.init()

      this.updateDependency('slackClient', this.slack)
    } catch (error) {
      console.error('Failed during initialization:', error)
    }
  }

  handleOnMessage(payload: EventPayload) {
    this.logger.debug('Received message:', payload)
    console.log('Received message:', payload)
    const event = this.formatMessageEvent(SLACK_MESSAGES.message, payload)
    this.emitEvent(SLACK_MESSAGES.message, event)
  }

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

  async getCredentials(): Promise<SlackCredentials> {
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
}
