import Redis from 'ioredis'
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
 * const redisPubSub = new RedisPubSub(REDIS_URL);
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
  private redisCloudUrl: string
  private publisher!: Redis
  private subscriber!: Redis

  private channelRefCount = new Map<string, number>()
  private patternRefCount = new Map<string, number>()
  private channelCallbacks = new Map<string, Array<Function>>()
  private patternCallbacks = new Map<string, Array<Function>>()

  // Improved handling of reconnection attempts
  async reconnectRedisClient(
    clientType: 'subscriber' | 'publisher',
    initialDelay = 100,
    maxDelay = 5000
  ) {
    let delay = initialDelay // Starting delay
    let attempt = 0 // Attempt counter

    const reconnect = async () => {
      attempt = attempt + 1 // Increment attempt counter
      try {
        console.warn(
          `Attempting ${clientType} reconnection, attempt ${attempt}...`
        )

        try {
          await this[clientType].quit()
        } catch (quitError) {
          console.warn(`Error quitting the ${clientType} client: ${quitError}`)
        }

        const client = await this.createConnection(this.redisCloudUrl)

        this[clientType] = client

        this.connectEventListeners(client, clientType)

        // Set up the connect event listener to reinitialize subscriptions or other necessary setup
        client.once('connect', () => {
          console.log(
            `${clientType} reconnected successfully on attempt ${attempt}.`
          )

          delay = initialDelay // Reset the delay after a successful reconnection
          attempt = 0 // Reset attempt counter

          // Reattach all necessary event listeners or re-subscribe to channels and patterns
          if (clientType === 'subscriber') {
            this.reinitializeSubscriptions()
          }
        })

        console.log(`${clientType} reconnected successfully.`)
      } catch (error) {
        console.error(`${clientType} reconnection error:`, error)
        if (delay < maxDelay) {
          delay *= 2 // Exponential backoff
        } else {
          console.error(
            `Max reconnection attempts reached for ${clientType}. Check redis instance for issues.`
          )
        }
        setTimeout(reconnect, delay)
      }
    }
    reconnect()
  }

  async createConnection(redusUrl: string) {
    return new Redis(redusUrl, {
      maxRetriesPerRequest: null,
    })
  }

  constructor(redisCloudUrl: string) {
    super()
    this.redisCloudUrl = redisCloudUrl
  }

  /**
   * Initializes the Redis clients for publishing and subscribing.
   * This method should be called before attempting any publish/subscribe operations.
   *
   * @param _options - The Redis client options, including the URL and socket configurations.
   *
   * Example:
   * await redisPubSub.initialize({ /* RedisClientOptions *\/ });
   */
  async initialize(): Promise<void> {
    this.publisher = await this.createConnection(this.redisCloudUrl)
    this.subscriber = await this.createConnection(this.redisCloudUrl)

    console.log('Connecting to redis pubsub')
    // await this.client.connect()
    // await this.subscriber.connect()
    this.connectEventListeners(this.publisher, 'publisher')
    this.connectEventListeners(this.subscriber, 'subscriber')
  }

  connectEventListeners(client: Redis, clientType: 'subscriber' | 'publisher') {
    client.on('error', async error => {
      console.error(`Redis ${clientType} error:`, error)
      // Attempt to close and reconnect the client
      await this.reconnectRedisClient(clientType)
    })

    // "wait" | "reconnecting" | "connecting" | "connect" | "ready" | "close" | "end";

    client.on('connecting', () => {
      console.log(`Connecting to Redis ${clientType}...`)
    })

    client.on('connect', () => {
      console.log(`Redis ${clientType} connected successfully.`)
    })

    client.on('close', () => {
      console.log(`Redis ${clientType} connection closed.`)
    })

    client.on('reconnecting', () => {
      console.warn(`Reconnecting to Redis ${clientType}...`)
    })

    client.on('end', () => {
      console.log(`Redis ${clientType} connection ended.`)
    })

    client.on('ready', () => {
      console.log(`Redis ${clientType} is ready.`)
    })

    client.on('reconnecting', () => {
      console.log(`Redis ${clientType} reconnecing.`)
    })

    client.on('wait', time => {
      console.log(`Redis ${clientType} is waiting:`, time)
    })

    // handle subscriber reconnection

    if (clientType === 'subscriber') {
      console.log('Setting up subscriber event listeners...')
      client.on('message', (channel, message) => {
        this.emit(channel, message)
      })

      // Listen for pattern messages and emit them as events
      client.on('pmessage', (pattern, channel, message) => {
        this.emit(pattern, message)
      })
    }
  }

  reinitializeSubscriptions() {
    console.log('Reinitializing subscriptions...')
    // Reattach channel listeners
    this.channelCallbacks.forEach((callbacks, channel) => {
      // First, ensure no duplicate listeners by unsubscribing
      this.subscriber.unsubscribe(channel).then(() => {
        // Now, re-subscribe to each channel with its callbacks
        callbacks.forEach(callback => {
          console.log('Re-subscribing to channel:', channel)
          this.subscribe(channel, callback).catch(subscribeError => {
            console.error(
              `Error resubscribing to channel ${channel}:`,
              subscribeError
            )
          })
        })
      })
    })

    // Reattach pattern listeners similarly
    this.patternCallbacks.forEach((callbacks, pattern) => {
      // Unsubscribe to ensure no duplicates
      this.subscriber.punsubscribe(pattern).then(() => {
        // Re-subscribe with callbacks
        console.log('Re-subscribing to channel:', pattern)
        callbacks.forEach(callback => {
          this.patternSubscribe(pattern, callback).catch(subscribeError => {
            console.error(
              `Error resubscribing to pattern ${pattern}:`,
              subscribeError
            )
          })
        })
      })
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
    if (this.publisher.status !== 'ready') {
      throw new Error('Publisher not ready. Ensure Redis is connected.')
    }

    try {
      let serializedMessage
      if (typeof message === 'string') {
        serializedMessage = message
      } else if (typeof message === 'object') {
        serializedMessage = JSON.stringify(message)
      } else {
        throw new Error('Invalid message type. Expected string or object.')
      }

      await this.publisher.publish(channel, serializedMessage)
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
      await this.subscriber.subscribe(channel)

      this.subscriber.on('message', (ch, message) => {
        if (ch === channel) {
          messageListener(message)
        }
      })
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

    const messageListener = (messagePattern, channel, message) => {
      // check pattern
      if (messagePattern !== pattern) {
        return
      }

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
      await this.subscriber.psubscribe(pattern)

      this.subscriber.on('pmessage', messageListener)
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
      await this.subscriber.punsubscribe(pattern)
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
    this.publisher.quit()
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
