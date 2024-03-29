import { AGENT_ERROR, AGENT_EVENT, EventTypes } from 'communication'
import pino from 'pino'
import { getLogger } from 'server/logger'
import { ActionPayload, EventPayload } from 'server/plugin'
import { RedisPubSub } from 'server/redis-pubsub'

/**
 * CoreEventClient manages the subscription to specific Redis pub/sub channels
 * based on a pattern. It routes incoming messages to appropriate event handlers.
 * This class demonstrates an event-driven architecture, where events are published
 * and subscribed to over Redis channels. It uses pattern subscription to listen
 * to a range of channels and employs a mapping strategy to delegate messages to
 * their corresponding handlers based on the event type.
 *
 * Principles Highlighted:
 * - Pattern Subscription: Listens to a range of channels following a specific pattern.
 * - Event-Driven Architecture: Uses Redis pub/sub mechanism to handle events.
 * - Abstraction: Abstracts the complexity of Redis subscriptions and message handling.
 * - Scalability: Easily extendable for handling various event types.
 * - Clean Code: Provides clear, focused methods for specific event types.
 *
 * Usage Example:
 * ```typescript
 * const redisConnection = new Redis();
 * const agentId = 'your-agent-id';
 * const receiver = new CoreEventClient(redisConnection, agentId);
 * receiver.onMessage((message) => {
 *   console.log('Message received:', message);
 * });
 * ```
 */
class CoreEventClient {
  private logger: pino.Logger = getLogger()
  private pubSub: RedisPubSub
  private agentId: string
  private eventHandlers: Map<string, ((message: EventPayload) => void)[]>

  /**
   * Creates a new instance of CoreEventClient.
   * @param redisConnection The Redis connection to use for subscribing to channels.
   * @param agentId The agent ID to use for subscribing to channels.
   */
  constructor({ pubSub, agentId }: { pubSub: RedisPubSub; agentId: string }) {
    this.pubSub = pubSub
    this.agentId = agentId
    this.eventHandlers = new Map()
    this.subscribeToCoreEvents()
  }

  /**
   * Subscribes to Redis channels based on a pattern specific to the agent's core events.
   * It listens to all events of the format 'agent:{agentId}:Core:*'.
   *
   * This method demonstrates the use of pattern-based subscriptionas in Redis, which
   * is a powerful feature for subscribing to multiple channels with similar naming conventions.
   *
   * Example:
   * ```
   * const receiver = new CoreEventClient(redisConnection, 'agent123');
   * // This will subscribe to all channels matching 'agent:agent123:Core:*'
   * ```
   */
  private subscribeToCoreEvents(): void {
    const pattern = `agent:${this.agentId}:Core:*`
    this.logger.debug(`Subscribing to pattern '${pattern}'`)
    this.pubSub.patternSubscribe(pattern, this.coreEventHandler.bind(this))
  }

  /**
   * Handles incoming messages from subscribed channels. This method is called
   * whenever a new message is received on a channel that the receiver is subscribed to.
   * It uses a mapping strategy to route messages to the appropriate event handlers
   * based on the event type.
   *
   * Example:
   * ```
   * const receiver = new CoreEventClient(redisConnection, 'agent123');
   * receiver.onMessage((message) => {
   *   console.log('Message received:', message);
   * });
   * ```
   *
   * @param message The message received on the subscribed channel.
   * @param channel The channel on which the message was received.
   */
  coreEventHandler(event, channel) {
    const eventType = this.extractEventType(channel)

    this.logger.debug(`Received event of type '${eventType}'`)
    event.plugin = 'core'

    this.eventHandlers.get(eventType)?.forEach(handler => handler(event))
  }

  /**
   * Extracts the event type from the channel name.
   * Assumes the channel name follows the pattern 'agent:{agentId}:Core:{eventType}'.
   *
   * Example:
   * ```
   * const eventType = this.extractEventType('agent:agent123:Core:onMessage');
   * console.log(eventType); // Outputs: 'onMessage'
   * ```
   *
   * @param channel The channel name from which to extract the event type.
   * @returns The extracted event type.
   */
  private extractEventType(channel: string): string {
    return channel.split(':')[3]
  }

  /**
   * Registers a handler for a specific event type. This allows the CoreEventClient
   * to route messages to the appropriate function based on the event type.
   *
   * Example:
   * ```
   * receiver.registerHandler('onMessage', (message) => {
   *   console.log('New message:', message);
   * });
   * ```
   *
   * @param eventType The event type to register the handler for.
   * @param handler The function to handle the event.
   */
  registerHandler(
    eventType: string,
    handler: (message: EventPayload) => void
  ): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(handler)
  }

  /**
   * Helper method to register a handler for the 'onMessage' event.
   * This provides a clear and easy way for other parts of the application
   * to react to message events.
   *
   * Example:
   * ```
   * receiver.onMessage((message) => {
   *   console.log('Message event received:', message);
   * });
   * ```
   *
   * @param handler The function to handle 'onMessage' events.
   */
  onMessage(handler: (event: EventPayload) => void): void {
    this.logger.debug('Registering handler for core onMessage event')
    this.registerHandler(EventTypes.ON_MESSAGE, handler)
  }

  sendMessage(payload: ActionPayload): void {
    this.pubSub.publish(AGENT_EVENT(this.agentId), payload)
  }

  onError(payload: ActionPayload): void {
    this.pubSub.publish(AGENT_ERROR(this.agentId), payload)
  }

  /**
   * Unsubscribes from all subscribed Redis channels and clears event handlers.
   * This method is crucial for preventing memory leaks and ensuring that when
   * the receiver is no longer needed, it cleans up its resources properly.
   *
   * Example:
   * ```
   * // After finishing with the receiver
   * receiver.cleanup();
   * ```
   */
  cleanup(): void {
    const pattern = `agent:${this.agentId}:Core:*`
    this.pubSub.removePatternCallback(pattern, this.coreEventHandler.bind(this))
    this.eventHandlers.clear()
  }
}

export default CoreEventClient
