import {
  AllMiddlewareArgs,
  MessageEvent,
  SlackEventMiddlewareArgs,
  App,
} from '@slack/bolt'
import { SLACK_DEVELOPER_MODE, SLACK_EVENTS } from '../../constants'
import { EventPayload } from 'server/plugin'
import { SlackCredentials } from '../../types'
import { identifyMessageType } from './events'
export class SlackClient {
  private client: App
  emitEvent: (eventName: string, payload: EventPayload<any>) => void = () => {}

  constructor(
    private credentials: SlackCredentials,
    private agentId: string,
    emitEvent: (eventName: string, payload: EventPayload<any>) => void
  ) {
    this.client = new App({
      token: credentials.token,
      signingSecret: credentials.signingSecret,
      socketMode: true,
      appToken: credentials.appToken,
      developerMode: SLACK_DEVELOPER_MODE,
    })
    this.emitEvent = emitEvent
  }

  async init() {
    this.validateCredentials(this.credentials)
    await this.client?.start()
    await this.setupListeners(this.agentId)
  }

  private validateCredentials(credentials: SlackCredentials) {
    if (
      !credentials.token ||
      !credentials.signingSecret ||
      !credentials.appToken
    ) {
      throw new Error(
        `Missing required Slack credentials: ${[
          'token',
          'signingSecret',
          'appToken',
        ]
          .filter(key => !credentials[key])
          .join(', ')}`
      )
    }
  }

  getClient() {
    return this.client
  }

  async setupListeners(agentId: string) {
    Object.entries(SLACK_EVENTS).forEach(([messageType, eventName]) => {
      this.client.event(
        eventName,
        async (
          args: SlackEventMiddlewareArgs<typeof eventName> & AllMiddlewareArgs
        ) => {
          const eventType = identifyMessageType(args.event)

          if (!eventType) {
            return
          }
          console.log('identified message type', eventType)

          const eventPayload = this.createEventPayload(
            args.event,
            agentId,
            eventType,
            args
          )

          this.emitEvent(eventName, eventPayload)
        }
      )
    })
  }

  private createEventPayload(
    message: MessageEvent,
    agentId: string,
    messageType: string,
    rest: AllMiddlewareArgs
  ): EventPayload<AllMiddlewareArgs> {
    let payload: EventPayload<AllMiddlewareArgs> = {
      connector: 'slack',
      eventName: messageType,
      status: 'success',
      content: '',
      sender: '',
      observer: 'assistant',
      client: 'cloud.magickml.com',
      channel: message.channel,
      plugin: 'slack',
      agentId: agentId,
      channelType: message.channel_type,
      rawData: message,
      timestamp: new Date().toISOString(),
      data: rest,
      metadata: {},
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
}
