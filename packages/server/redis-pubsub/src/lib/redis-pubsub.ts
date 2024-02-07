import { createClient, RedisClientOptions } from 'redis'
import { EventEmitter } from 'events'

/**
 * A class for managing Redis Publish/Subscribe operations.
 *
 * This class abstracts the complexity of subscribing and publishing messages to Redis
 * channels and patterns.
 *
 * It uses reference counting to manage subscriptions, ensuring that channels and patterns
 * are only unsubscribed when no more listeners are interested in them. This is particularly
 * useful in applications with dynamic subscription needs.
 *
 * Design Patterns Used:
 * - Singleton: Ensures a single instance of Redis clients.
 * - Observer: Manages subscriptions and broadcasts messages to listeners.
 *
 * Principles:
 * - Encapsulation: Hides the complexity of direct Redis operations.
 * - Single Responsibility: Each method has a clear and distinct purpose.
 *
 * Usage Example:
 * ```typescript
 * const redisPubSub = new RedisPubSub();
 * await redisPubSub.initialize({});
 * redisPubSub.subscribe('myChannel', message => console.log(message));
 * redisPubSub.unsubscribe('myChannel');
 * redisPubSub.close();
 * ```
 *
 * Note: Always ensure to call `close()` when the instance is no longer needed to prevent
 * resource leaks.
 */
export class RedisPubSub extends EventEmitter {
  private client!: ReturnType<typeof createClient>
  private subscriber!: ReturnType<typeof createClient>

  private channelRefCount = new Map<string, number>()
  private patternRefCount = new Map<string, number>()
  private channelCallbacks = new Map<string, Array<Function>>()
  private patternCallbacks = new Map<string, Array<Function>>()

  /**
   * Initializes the Redis clients for publishing and subscribing.
   * This method should be called before attempting any publish/subscribe operations.
   *
   * @param _options - The Redis client options, including the URL and socket configurations.
   *
   * Example:
   * await redisPubSub.initialize({ /* RedisClientOptions *\/ });
   */
  async initialize(
    redisCloudUrl: string,
    _options: RedisClientOptions = {}
  ): Promise<void> {
    const options: RedisClientOptions = {
      ..._options,
      url: redisCloudUrl,
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

    this.subscriber.on('error', async error => {
      console.error('Redis subscriber error:', error)
      // Attempt to close and reconnect the subscriber
      try {
        await this.subscriber.quit()
        this.subscriber = createClient(options)
        await this.subscriber.connect()
      } catch (reconnectError) {
        console.error('Redis subscriber reconnect error:', reconnectError)
        return
      }

      // Reattach listeners to channels
      this.channelCallbacks.forEach((callbacks, channel) => {
        callbacks.forEach(callback => {
          // Re-subscribe to channel with each callback
          this.subscribe(channel, callback).catch(subscribeError => {
            console.error(
              `Error resubscribing to channel ${channel}:`,
              subscribeError
            )
          })
        })
      })

      // Reattach listeners to patterns
      this.patternCallbacks.forEach((callbacks, pattern) => {
        callbacks.forEach(callback => {
          // Re-subscribe to pattern with each callback
          this.patternSubscribe(pattern, callback).catch(subscribeError => {
            console.error(
              `Error resubscribing to pattern ${pattern}:`,
              subscribeError
            )
          })
        })
      })
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

  /**
   * Publishes a message to the specified Redis channel.
   *
   * @param channel - The Redis channel to publish the message to.
   * @param message - The message to be published. Can be a string or an object.
   *
   * Example:
   * await redisPubSub.publish('myChannel', 'Hello World');
   */
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

  /**
   * Subscribes to a Redis channel with a callback to handle incoming messages.
   *
   * @param channel - The Redis channel to subscribe to.
   * @param callback - The callback function to invoke with the message.
   *
   * Example:
   * redisPubSub.subscribe('myChannel', message => console.log(message));
   */
  async subscribe(channel: string, callback) {
    this.channelRefCount.set(
      channel,
      (this.channelRefCount.get(channel) || 0) + 1
    )

    if (!this.channelCallbacks.has(channel)) {
      this.channelCallbacks.set(channel, [])
    }

    this.channelCallbacks.get(channel)!.push(callback)

    const messageListener = message => {
      let deserializedMessage
      try {
        deserializedMessage = JSON.parse(message)
        callback(deserializedMessage)
      } catch (err) {
        console.error('Failed to deserialize message:', err)
        throw err
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

  /**
   * Subscribes to a Redis pattern with a callback to handle incoming messages.
   *
   * @param pattern - The Redis pattern to subscribe to.
   * @param callback - The callback function to invoke with the message and channel.
   *
   * Example:
   * redisPubSub.patternSubscribe('myPattern*', (message, channel) => console.log(message, channel));
   */
  async patternSubscribe(pattern, callback) {
    this.patternRefCount.set(
      pattern,
      (this.patternRefCount.get(pattern) || 0) + 1
    )

    // Store the callback for the pattern
    if (!this.patternCallbacks.has(pattern)) {
      this.patternCallbacks.set(pattern, [])
    }

    this.patternCallbacks.get(pattern)!.push(callback)

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

  /**
   * Unsubscribes from a Redis pattern.
   *
   * @param pattern - The Redis pattern to unsubscribe from.
   *
   * Example:
   * await redisPubSub.patternUnsubscribe('myPattern*');
   */
  async patternUnsubscribe(pattern) {
    const currentCount = this.patternRefCount.get(pattern) || 0
    if (currentCount > 1) {
      // Decrease reference count but don't actually unsubscribe
      this.patternRefCount.set(pattern, currentCount - 1)
    } else {
      // Unsubscribe only when count is 1 or less
      await this.subscriber.pUnsubscribe(pattern)
      this.patternRefCount.delete(pattern)
      this.patternCallbacks.delete(pattern) // Remove all callbacks
      console.log(`Unsubscribed from the ${pattern} pattern.`)
    }
  }

  /**
   * Unsubscribes from a Redis channel.
   *
   * @param channel - The Redis channel to unsubscribe from.
   *
   * Example:
   * await redisPubSub.unsubscribe('myChannel');
   */
  async unsubscribe(channel) {
    const currentCount = this.channelRefCount.get(channel) || 0
    if (currentCount > 1) {
      // Decrease reference count but don't actually unsubscribe
      this.channelRefCount.set(channel, currentCount - 1)
    } else {
      // Unsubscribe only when count is 1 or less
      await this.subscriber.unsubscribe(channel)
      this.channelRefCount.delete(channel)
      this.channelCallbacks.delete(channel) // Remove all callbacks
      console.log(`Unsubscribed from the ${channel} channel.`)
    }
  }

  async unsubscribeAll() {
    const channels = Array.from(this.channelRefCount.keys())
    const patterns = Array.from(this.patternRefCount.keys())

    await Promise.all([
      ...channels.map(channel => this.unsubscribe(channel)),
      ...patterns.map(pattern => this.patternUnsubscribe(pattern)),
    ])
  }

  /**
   * Removes a specific callback from a given channel.
   * This method is useful when you need to detach a particular callback from a channel
   * without affecting other callbacks.
   *
   * @param channel - The channel from which the callback should be removed.
   * @param callbackToRemove - The callback function to remove.
   *
   * Usage Example:
   * const myCallback = message => console.log(message);
   * redisPubSub.subscribe('myChannel', myCallback);
   * // Later, to remove the callback
   * redisPubSub.removeCallback('myChannel', myCallback);
   */
  removeCallback(channel, callbackToRemove) {
    const callbacks = this.channelCallbacks.get(channel)
    if (callbacks) {
      // Filter out the specific callback
      this.channelCallbacks.set(
        channel,
        callbacks.filter(callback => callback !== callbackToRemove)
      )
    }
  }

  /**
   * Removes a specific callback from a given pattern subscription.
   * This method is useful for detaching a particular callback from a pattern subscription, similar to `removeCallback` for channels.
   *
   * @param pattern - The pattern from which the callback should be removed.
   * @param callbackToRemove - The callback function to remove.
   *
   * Usage Example:
   * const myPatternCallback = (message, channel) => console.log(message, channel);
   * redisPubSub.patternSubscribe('myPattern*', myPatternCallback);
   * // Later, to remove the callback
   * redisPubSub.removePatternCallback('myPattern*', myPatternCallback);
   */
  removePatternCallback(pattern, callbackToRemove) {
    const callbacks = this.patternCallbacks.get(pattern)
    if (callbacks) {
      // Filter out the specific callback
      this.patternCallbacks.set(
        pattern,
        callbacks.filter(callback => callback !== callbackToRemove)
      )
    }
  }

  /**
   * Closes the Redis client connections.
   * This method should be called when the RedisPubSub instance is no longer needed to properly release resources and prevent memory leaks.
   *
   * Usage Example:
   * redisPubSub.close();
   */
  close(): void {
    this.client.quit()
    this.subscriber.quit()
  }

  /**
   * Waits for and retrieves the next message on a specified channel.
   * This method is useful for scenarios where you need to handle messages in a promise-based manner.
   *
   * @param channel - The channel to listen for the next message.
   * @returns A promise that resolves with the next message received on the specified channel.
   *
   * Usage Example:
   * redisPubSub.getNextMessage('myChannel').then(message => console.log(message));
   */
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

  /**
   * Waits for and retrieves the next message on a specified pattern.
   * Similar to `getNextMessage`, but for pattern subscriptions.
   *
   * @param pattern - The pattern to listen for the next message.
   * @returns A promise that resolves with the next message received on the specified pattern.
   *
   * Usage Example:
   * redisPubSub.getNextPatternMessage('myPattern*').then(message => console.log(message));
   */
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

  /**
   * Implements a retry strategy with exponential backoff for the Redis client connections.
   * This method is invoked internally in the event of connection failures and attempts to reconnect with increasing delays.
   *
   * @param attempt - The current attempt number.
   * @returns The time to wait before the next reconnection attempt.
   *
   * Usage Note:
   * This method is private and used internally by the Redis client to manage reconnection attempts.
   */
  private retryStrategy(attempt: number): number {
    if (attempt > 10) {
      // We have tried to connect over 10 times, so don't retry
      throw new Error('Max reconnection attempts reached')
    }
    // Use exponential backoff
    return Math.min(attempt * 100, 3000)
  }

  onDestroy() {
    this.unsubscribeAll()
    this.close()
  }
}
