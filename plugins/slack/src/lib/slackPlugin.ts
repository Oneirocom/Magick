import Redis from 'ioredis'
import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import { Job } from 'bullmq'
import {
  ActionPayload,
  CoreEventsPlugin,
  EventPayload,
} from 'packages/server/plugin/src'
import { ON_SLACK_MESSAGE } from './events'
import { SlackEmitter } from './dependencies/slackEmitter'
import { SlackActionService } from './services/slackActionService'
import SlackEventClient from './services/slackEventClient'
import { sendSlackMessage } from './nodes/actions/sendSlackMessage'
import { slackMessageEvent } from './nodes/events/slackMessageEvent'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { SpellCaster } from 'packages/server/grimoire/src'

const pluginName = 'Slack'

export class SlackPlugin extends CoreEventsPlugin {
  override enabled = true
  client: SlackEventClient
  nodes = [slackMessageEvent, sendSlackMessage]
  values = []

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId)

    this.client = new SlackEventClient(pubSub, agentId)
  }

  defineEvents(): void {
    this.registerEvent({
      eventName: ON_SLACK_MESSAGE,
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
      [pluginName]: new SlackEmitter(),
      slackActionService: new SlackActionService(
        this.connection,
        this.actionQueueName
      ),
    }
  }

  override provideRegistry(registry: IRegistry): IRegistry {
    return registerCoreProfile(registry)
  }

  initializeFunctionalities() {
    this.centralEventBus.on(ON_SLACK_MESSAGE, this.handleOnMessage.bind(this))
    this.client.onMessage(this.handleOnMessage.bind(this))
  }

  handleOnMessage(payload: EventPayload) {
    console.log('handleOnSlackMessage', payload)
    const event = this.formatMessageEvent(ON_SLACK_MESSAGE, payload)
    this.emitEvent(ON_SLACK_MESSAGE, event)
  }

  handleSendMessage(actionPayload: Job<ActionPayload>) {
    const { actionName, event } = actionPayload.data
    const { plugin } = event
    const eventName = `${plugin}:${actionName}`

    if (plugin === 'Slack') {
      this.client.sendMessage(actionPayload.data)
    } else {
      this.centralEventBus.emit(eventName, actionPayload.data)
    }
  }

  formatPayload(event, payload) {
    return payload
  }
}
