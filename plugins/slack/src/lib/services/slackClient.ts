import {
  AllMiddlewareArgs,
  MessageEvent,
  SlackEventMiddlewareArgs,
  App,
} from '@slack/bolt'
import { SLACK_MESSAGES } from '../constants'
import { EventPayload } from 'server/plugin'
import { SlackCredentials } from '../types'

const SLACK_DEVELOPER_MODE = false

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

  setupListeners(agentId: string) {
    Object.entries(SLACK_MESSAGES).forEach(([messageType, eventName]) => {
      this.client.event(
        eventName,
        async (
          args: SlackEventMiddlewareArgs<typeof eventName> & AllMiddlewareArgs
        ) => {
          // if (args.message?.type === 'message') {
          const eventPayload: EventPayload<any> = this.createEventPayload(
            // @ts-ignore
            args.message,
            agentId,
            eventName,
            args
          )
          this.emitEvent(eventName, eventPayload)
        }
        // }
      )
    })
  }

  private createEventPayload(
    message: MessageEvent,
    agentId: string,
    messageType: string,
    rest: AllMiddlewareArgs
  ): EventPayload<any> {
    if ('text' in message && 'user' in message && 'channel_type' in message) {
      return {
        connector: 'slack',
        eventName: messageType,
        status: 'success',
        content: message.text ?? '',
        sender: message.user ?? '',
        observer: 'assistant',
        client: 'cloud.magickml.com',
        channel: message.channel,
        plugin: 'slack',
        agentId: agentId,
        channelType: message.channel_type,
        rawData: (rest as any).body,
        timestamp: new Date().toISOString(),
        data: message,
        metadata: {},
      }
    }
    throw new Error('Message event does not have the expected properties.')
  }
}
