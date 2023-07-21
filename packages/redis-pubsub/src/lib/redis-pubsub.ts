import { createClient, RedisClientOptions } from 'redis'
import { EventEmitter } from 'events'
import { REDISCLOUD_URL } from '@magickml/config'

export class RedisPubSub extends EventEmitter {
  private client!: ReturnType<typeof createClient>
  private subscriber!: ReturnType<typeof createClient>

  async initialize(_options: RedisClientOptions): Promise<void> {
    const options: RedisClientOptions = {
      ..._options,
      url: REDISCLOUD_URL,
      socket: {
        ..._options?.socket,
        reconnectStrategy: this.retryStrategy,
      },
    }

    this.client = createClient(options)
    this.subscriber = createClient(options)

    console.log('Connecting to redis pubsub')
    await this.client.connect()
    await this.subscriber.connect()

    this.subscriber.on('error', error => {
      console.error('Redis subscriber error:', error)
    })

    this.client.on('error', error => {
      console.error('Redis client error:', error)
    })

    // Listen for messages and emit them as events
    this.subscriber.on('message', (channel, message) => {
      this.emit(channel, message)
    })

    // Listen for pattern messages and emit them as events
    this.subscriber.on('pmessage', (pattern, channel, message) => {
      this.emit(pattern, message)
    })
  }

  async publish(channel, message) {
    try {
      let serializedMessage
      if (typeof message === 'string') {
        serializedMessage = message
      } else if (typeof message === 'object') {
        serializedMessage = JSON.stringify(message)
      } else {
        throw new Error('Invalid message type. Expected string or object.')
      }

      await this.client.publish(channel, serializedMessage)
    } catch (err) {
      console.error('Failed to publish message:', err)
    }
  }

  async subscribe(channel, callback) {
    const messageListener = message => {
      let deserializedMessage
      try {
        deserializedMessage = JSON.parse(message)
        callback(deserializedMessage)
      } catch (err) {
        console.error('Failed to deserialize message:', err)
        return
      }
    }

    try {
      await this.subscriber.subscribe(channel, messageListener)
      console.log(
        `Subscribed to the ${channel} channel. Listening for updates.`
      )
    } catch (err) {
      console.error('Failed to subscribe to channel:', err)
      return
    }
  }

  async patternSubscribe(pattern, callback) {
    const messageListener = (message, channel) => {
      let deserializedMessage
      try {
        deserializedMessage = JSON.parse(message)
        callback(deserializedMessage, channel)
      } catch (err) {
        console.error('Failed to deserialize message:', err)
        return
      }
    }

    try {
      await this.subscriber.pSubscribe(pattern, messageListener)
      console.log(
        `Subscribed to the ${pattern} channel. Listening for updates.`
      )
    } catch (err) {
      console.error('Failed to subscribe to channel:', err)
      return
    }
  }

  async unsubscribe(channel) {
    try {
      await this.subscriber.unsubscribe(channel)
      console.log(`Unsubscribed from the ${channel} channel.`)
    } catch (err) {
      console.error('Failed to unsubscribe from channel:', err)
      return
    }
  }

  close(): void {
    this.client.quit()
    this.subscriber.quit()
  }

  // Message handling with promises is more complex, as messages can come in at any time.
  // So, we can provide a method to wait for the next message on a channel.
  // This method returns a promise that resolves with the next message received on the specified channel.
  getNextMessage(channel: string): Promise<string> {
    return new Promise(resolve => {
      const listener = (ch: string, message: string) => {
        if (ch === channel) {
          this.subscriber.removeListener('message', listener)
          resolve(message)
        }
      }
      this.subscriber.on('message', listener)
    })
  }

  // Method to wait for the next message on a pattern.
  // This method returns a promise that resolves with the next message received on the specified pattern.
  getNextPatternMessage(pattern: string): Promise<string> {
    return new Promise(resolve => {
      const listener = (pat: string, channel: string, message: string) => {
        if (pat === pattern) {
          this.subscriber.removeListener('pmessage', listener)
          resolve(message)
        }
      }
      this.subscriber.on('pmessage', listener)
    })
  }

  // Retry strategy with exponential backoff
  private retryStrategy(attempt: number): number {
    if (attempt > 10) {
      // We have tried to connect over 10 times, so don't retry
      throw new Error('Max reconnection attempts reached')
    }
    // Use exponential backoff
    return Math.min(attempt * 100, 3000)
  }
}
