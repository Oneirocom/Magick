import { getLogger } from 'packages/server/logger/src'
import { SlackEventPayload, SlackMessageEvent } from '../types'
import { EventPayload } from 'packages/server/plugin/src'
import { ON_SLACK_MESSAGE, AGENT_SLACK_MESSAGE } from '../events'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { FEATURE_FLAGS } from 'packages/shared/config/src'

export class SlackService {
  private redisPubSub: RedisPubSub

  constructor(redisPubSub: RedisPubSub) {
    this.redisPubSub = new RedisPubSub()
    this.redisPubSub.initialize({})
  }

  async create(data: SlackEventPayload) {
    const logger = getLogger()
    if (data?.event?.bot_id) {
      return { message: 'Slack bot message received' }
    }

    if (data.challenge) {
      logger.info('Slack verification request received', { data })
      return { challenge: data.challenge }
    }

    if (!data.event) {
      logger.error('Slack event missing type', { data })
      throw new Error('Slack event missing type.')
    }

    switch (data.event.type) {
      case 'message':
        const timestamp = new Date().toISOString()

        const eventPayload: EventPayload<SlackMessageEvent> = {
          connector: 'slack',
          eventName: ON_SLACK_MESSAGE,
          status: 'success',
          content: data.event.text,
          sender: data.event.user || 'defaultUser',
          observer: 'assistant',
          client: 'cloud.magickml.com',
          channel: data.event.channel,
          plugin: 'Slack',
          agentId: FEATURE_FLAGS.SLACK_AGENT_ID,
          channelType: 'SlackChannel',
          rawData: data,
          timestamp: timestamp,
          data: data.event,
          metadata: {},
        }

        await this.redisPubSub.publish(
          AGENT_SLACK_MESSAGE(FEATURE_FLAGS.SLACK_AGENT_ID),
          eventPayload
        )

        return { message: 'Slack message received' }
      default:
        logger.error('Unknown Slack event type', { data })
        throw Error('Unknown Slack event type.')
    }
  }

  // TODO: handle cleanup
  async close() {
    this.redisPubSub.close()
  }
}
