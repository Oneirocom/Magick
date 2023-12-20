import { RedisPubSub } from 'server/redis-pubsub'
import { PubSub } from './PubSub'

export class RedisPubSubWrapper extends PubSub {
  pubsub: RedisPubSub

  constructor(pubsub: RedisPubSub) {
    super()
    this.pubsub = pubsub
  }

  override async publish(channel: string, message: string): Promise<void> {
    return await this.pubsub.publish(channel, message)
  }

  override async subscribe(channel: string, callback: Function): Promise<void> {
    return await this.pubsub.subscribe(channel, callback)
  }

  override async patternSubscribe(
    pattern: string,
    callback: Function
  ): Promise<void> {
    return await this.pubsub.patternSubscribe(pattern, callback)
  }
}
