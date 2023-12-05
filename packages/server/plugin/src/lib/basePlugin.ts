import { EventEmitter } from 'events'
import Redis from 'ioredis'
import { Plugin } from './plugin'
import {
  IRegistry,
  NodeDefinition,
  ValueType,
  ValueTypeMap,
  memo,
} from '@magickml/behave-graph'
import { BullQueue } from 'server/communication'
import { getLogger } from 'server/logger'

export type RegistryFactory = (registry?: IRegistry) => IRegistry
/**
 * Interface for defining an event.
 * @property eventName - The unique name of the event, typically namespaced.
 * @property displayName - A user-friendly name for the event.
 * @property payloadType - The type of data the event carries.
 */
interface EventDefinition {
  eventName: string
  displayName: string
}

export type EventFormat<
  Data = Record<string, unknown>,
  Y = Record<string, unknown>
> = {
  content: string
  sender: string
  channelId: string
  entities?: any[]
  rawData: unknown
  channelType: string
  observer: string
  client: string
  data: Data
  metadata?: Y
  status?: 'success' | 'error' | 'pending' | 'unknown'
}

export type EventPayload<
  T = Record<string, unknown>,
  Y = Record<string, unknown>
> = {
  connector: string
  eventName: string
  status: 'success' | 'error' | 'pending' | 'unknown'
  content: string
  sender: string
  observer: string
  client: string
  channel: string
  // agentId: string
  // entities: any[]
  channelType: string
  rawData: unknown
  timestamp: string
  data: T
  metadata: Y
}

/**
 * The `BasePlugin` class serves as an abstract foundation for creating plugins within the system.
 * It encapsulates common functionalities and structures that are shared across various plugins,
 * providing a consistent interface and lifecycle management.
 *
 * Core Principles:
 * 1. Event-Driven Architecture: Plugins can emit and respond to events. This aligns with the
 *    reactive programming model, where the flow of the program is driven by events.
 * 2. Extensibility: Through inheritance, specific plugins can extend `BasePlugin`, customizing
 *    or enhancing the base functionality.
 * 3. Abstraction: It abstracts away common functionalities like event handling, queue management, and logging,
 *    allowing developers to focus on plugin-specific logic.
 * 4. Encapsulation: By encapsulating event and queue logic within the plugin, it maintains a separation
 *    of concerns, making the code more manageable and modular.
 *
 * Design Patterns:
 * - Template Method: The class provides a skeletal implementation with `abstract` methods like `defineEvents`
 *   and `initializeFunctionalities` that subclasses should override.
 * - Observer: Through the use of `EventEmitter`, the class follows the observer pattern, allowing subscribers
 *   to react to emitted events.
 * - Command: The emission of events can be seen as a command pattern, where an event triggers specific actions or
 *   commands.
 *
 * Strengths:
 * - Reduced Boilerplate: Common functionalities like event handling are handled by the base class, reducing
 *   redundancy in subclasses.
 * - Consistency: It enforces a consistent structure and lifecycle for plugins, making the system predictable and
 *   easier to understand.
 * - Scalability: The event-driven nature facilitates loose coupling and scalability, as new plugins can be easily
 *   integrated.
 * - Testability: With well-defined interfaces and separation of concerns, testing individual plugins becomes more
 *   straightforward.
 *
 * Example Usage:
 * // Assuming there's a `CustomPlugin` that extends `BasePlugin`
 * class CustomPlugin extends BasePlugin {
 *   constructor(name: string, connection: Redis, agentId: string) {
 *     super(name, connection, agentId);
 *   }
 *
 *   defineEvents() {
 *     this.registerEvent({
 *       eventName: 'customEvent',
 *       displayName: 'Custom Event',
 *     });
 *   }
 *
 *   initializeFunctionalities() {
 *     // Custom initialization logic for the plugin
 *   }
 * }
 *
 * // Usage
 * const customPlugin = new CustomPlugin('MyCustomPlugin', redisConnection, 'agent123');
 * customPlugin.activate();
 *
 * Note:
 * This class should be used as a base for creating new plugins. It's not meant to be instantiated directly,
 * but to be extended by concrete plugin implementations.
 *
 * @property name - The name of the plugin.
 * @property events - An array of events the plugin can emit.
 * @property eventEmitter - The event emitter for emitting events.
 * @property eventQueue - The BullMQ queue for processing events.
 * @property enabled - The enabled state of the plugin.
 */
export abstract class BasePlugin<
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>
> extends Plugin {
  protected events: EventDefinition[]
  protected eventQueue: BullQueue
  protected centralEventBus!: EventEmitter
  abstract nodes?: NodeDefinition[]
  abstract values?: ValueType[]
  protected agentId: string
  enabled: boolean = false
  logger = getLogger()
  eventEmitter: EventEmitter

  /**
   * Creates an instance of BasePlugin.
   * @param name The name of the plugin.
   * @example
   * const myPlugin = new BasePlugin('MyPlugin');
   */
  constructor(name: string, connection: Redis, agentId: string) {
    super({ name })
    this.agentId = agentId
    this.eventEmitter = new EventEmitter()
    this.eventQueue = new BullQueue(connection)
    this.eventQueue.initialize(this.queueName)
    this.events = []
  }

  /**
   * Initializes the plugin by defining events and initializing functionalities.
   */
  init(centralEventBus: EventEmitter) {
    this.centralEventBus = centralEventBus
    this.defineEvents()
    this.initializeFunctionalities()
    this.mapEventsToQueue()
  }

  /**
   * Returns a dictionary of the behave values this plugin may provide
   * @returns A dictionary of the behave values
   */
  protected getPluginValues = memo<ValueTypeMap>(() => {
    const valueTypes = this.values

    if (!valueTypes) return {}

    return Object.fromEntries(
      valueTypes.map(valueType => [valueType.name, valueType])
    )
  })

  /**
   * Returns a dictionary of the behave nodes this plugin may provide
   * @returns A dictionary of the behave nodes
   */
  protected getPluginNodes = memo<Record<string, NodeDefinition>>(() => {
    const nodeDefinitions = this.nodes

    if (!nodeDefinitions) return {}

    return Object.fromEntries(
      nodeDefinitions.map(nodeDefinition => [
        nodeDefinition.typeName,
        nodeDefinition,
      ])
    )
  })

  /**
   * Emits an event with the given name and payload.
   * @param eventName The name of the event to emit.
   * @param payload The payload of the event.
   * @example
   * this.emitEvent('myEvent', { data: 'example' });
   */
  protected emitEvent(eventName: string, payload: EventPayload) {
    if (!this.enabled) return
    this.eventEmitter.emit(eventName, payload)
  }

  /**
   * Returns the name of the BullMQ queue for the plugin.
   * Format: event:pluginName
   * @returns The name of the queue.
   * @example
   * const queueName = this.getQueueName();
   */
  get queueName() {
    return `agent:${this.agentId}:${this.name}:event`
  }

  /**
   * optional method to be override by plugins to provide an additional registry when needed.
   */
  provideRegistry(registry: IRegistry): IRegistry {
    return registry
  }

  abstract getDependencies(): Record<string, any>

  /**
   * Returns a registry object merged with the plugin's specific registry.
   * @param existingRegistry An existing registry to merge with the plugin's registry.
   * @returns A merged registry object.
   */
  getRegistry(existingRegistry: IRegistry): IRegistry {
    // Define the plugin-specific values, nodes, and dependencies
    const pluginValues = this.getPluginValues()
    const pluginNodes = this.getPluginNodes()
    const pluginDependencies = this.getDependencies()

    // Merge the plugin's registry with the existing registry
    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: { ...existingRegistry.dependencies, ...pluginDependencies },
    }

    return this.provideRegistry(registry)
  }

  /**
   * Activates the plugin, making it ready for operation.
   */
  activate(): void {
    // Activation logic specific to the plugin
    this.setEnabled(true)
    this.logger.debug(`Plugin ${this.name} activated`)
  }

  /**
   * Deactivates the plugin, putting it into a passive state.
   */
  deactivate(): void {
    // Deactivation logic specific to the plugin
    this.setEnabled(false)
    this.logger.debug(`Plugin ${this.name} deactivated`)
  }

  /**
   * Cleans up resources and performs necessary teardown tasks.
   */
  destroy(): void {
    // Remove all listeners to prevent memory leaks
    this.eventEmitter.removeAllListeners()

    this.logger.debug(`Plugin ${this.name} destroyed.`)
  }

  /**
   * Sets the enabled state of the plugin.
   * @param state The state to set the plugin to.
   * @example
   * this.setEnabled(true);
   */
  setEnabled(state: boolean) {
    this.enabled = state
  }

  /**
   * Registers an event with the plugin.
   * @param event The event definition to register.
   * @example
   * this.registerEvent({
   *   eventName: 'myEvent',
   *   displayName: 'My Event',
   *   payloadType: MyPayloadType
   * });
   */
  registerEvent(event: EventDefinition) {
    this.events.push(event)
  }

  /**
   * Returns the list of registered events.
   * @returns An array of EventDefinition objects.
   * @example
   * const events = this.getEvents();
   */
  getEvents() {
    return this.events
  }

  /**
   * Abstract method to be implemented by plugins to define their events.
   * @example
   * defineEvents() {
   *  this.registerEvent({
   *   eventName: 'myEvent',
   *   displayName: 'My Event',
   *   payloadType: MyPayloadType
   * });xz
   */
  abstract defineEvents(): void

  /**
   * Abstract method to be implemented by plugins to initialize their functionalities.
   * @example
   * initializeFunctionalities() {
   *   this.discordClient.on('messageCreate', this.handleMessageCreate.bind(this));
   *   this.discordClient.login('YOUR_DISCORD_BOT_TOKEN');
   * }
   */
  abstract initializeFunctionalities(): void

  /**
   * Maps registered events to a BullMQ queue.
   * Each event emission will create a job in the BullMQ queue.
   */
  mapEventsToQueue() {
    this.events.forEach(event => {
      this.eventEmitter.on(event.eventName, async payload => {
        payload.eventName = event.eventName
        this.logger.debug(`Sending event ${event.eventName} to queue`)
        await this.eventQueue.addJob(event.eventName, payload)
      })
    })
  }

  /**
   * Abstract method for formatting the event payload.
   * Each plugin should implement this method to format its specific event data.
   * The formatMessageEvent method can be used to format a message event.
   * @param event The event name.
   * @param details The specific details of the event.
   * @returns Formatted event payload.
   */
  abstract formatPayload(
    event: string,
    details: Payload
  ): EventPayload<Data, Metadata>

  /**
   * Formats to an event payload for a message.
   * @param messageDetails Details of the message to format.
   * @returns Formatted message event payload.
   */
  formatMessageEvent<Data, Metadata>(
    event,
    messageDetails: EventFormat<Data, Metadata>
  ): EventPayload<Data, Metadata> {
    return {
      connector: this.name,
      client: messageDetails.client,
      eventName: event,
      status: messageDetails.status || 'success',
      content: messageDetails.content,
      sender: messageDetails.sender,
      observer: messageDetails.observer,
      channel: messageDetails.channelId,
      // agentId: this.agent.id, // Assuming this.agent is accessible
      // entities: messageDetails.entities,
      channelType: messageDetails.channelType,
      rawData: messageDetails.rawData,
      metadata: messageDetails.metadata || ({} as Metadata),
      data: messageDetails.data || ({} as Data),
      timestamp: new Date().toISOString(),
    }
  }
}

export default BasePlugin
