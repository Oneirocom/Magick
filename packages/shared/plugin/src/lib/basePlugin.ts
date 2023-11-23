import { EventEmitter } from 'events'
// import { BullQueue } from 'server/core'
import { Plugin } from './plugin'
import {
  IRegistry,
  NodeDefinition,
  ValueType,
  ValueTypeMap,
  memo,
} from '@magickml/behave-graph'

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

export type EventFormat = {
  content: string
  senderId: string
  channelId: string
  entities?: any[]
  rawData: unknown
  channelType: string
  observer: string
  metadata?: Record<string, any>
  status?: 'success' | 'error' | 'pending' | 'unknown'
}

export type EventPayload = {
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
  metadata: Record<string, any>
}

/**
 * Abstract base class for plugins.
 * @property name - The name of the plugin.
 * @property events - An array of events the plugin can emit.
 * @property eventEmitter - The event emitter for emitting events.
 * @property eventQueue - The BullMQ queue for processing events.
 * @property enabled - The enabled state of the plugin.
 */
export abstract class BasePlugin extends Plugin {
  protected events: EventDefinition[]
  // protected eventQueue: BullQueue
  protected enabled: boolean = false
  dependencies: Record<string, any>
  nodes: NodeDefinition[]
  values: ValueType[]
  eventEmitter: EventEmitter

  /**
   * Creates an instance of BasePlugin.
   * @param name The name of the plugin.
   * @example
   * const myPlugin = new BasePlugin('MyPlugin');
   */
  constructor(name: string) {
    super({ name })
    this.eventEmitter = new EventEmitter()
    // this.eventQueue = new BullQueue()
    // this.eventQueue.initialize(this.queueName)
    this.events = []
    this.nodes = []
    this.values = []
    this.dependencies = []
    this.defineEvents()
    this.initializeFunctionalities()
  }

  /**
   * Returns a dictionary of the behave values this plugin may provide
   * @returns A dictionary of the behave values
   */
  protected getPluginValues = memo<ValueTypeMap>(() => {
    const valueTypes = this.values
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

    return Object.fromEntries(
      nodeDefinitions.map(nodeDefinition => [
        nodeDefinition.typeName,
        nodeDefinition,
      ])
    )
  })

  /**
   * Returns a dictionary of the behave dependencies this plugin may provide
   * @returns A dictionary of the behave dependencies
   */
  protected getPluginDependencies = memo<Record<string, any>>(() => {
    const dependencies = this.dependencies

    return Object.fromEntries(
      dependencies.map(dependency => [dependency.name, dependency])
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
    return `event:${this.name}`
  }

  /**
   * Returns a registry object merged with the plugin's specific registry.
   * @param existingRegistry An existing registry to merge with the plugin's registry.
   * @returns A merged registry object.
   */
  getRegistry(existingRegistry: IRegistry): IRegistry {
    // Define the plugin-specific values, nodes, and dependencies
    const pluginValues = this.getPluginValues()
    const pluginNodes = this.getPluginNodes()
    const pluginDependencies = this.getPluginDependencies()

    // Merge the plugin's registry with the existing registry
    return {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: { ...existingRegistry.dependencies, ...pluginDependencies },
    }
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
        const namespacedEventName = `${this.name}:${event.eventName}`
        // await this.eventQueue.addJob(namespacedEventName, payload)
      })
    })
  }

  /**
   * Formats to an event payload for a message.
   * @param messageDetails Details of the message to format.
   * @returns Formatted message event payload.
   */
  formatMessageEvent(event, messageDetails: EventFormat): EventPayload {
    return {
      connector: this.name,
      eventName: event,
      status: messageDetails.status || 'success',
      content: messageDetails.content,
      sender: messageDetails.senderId,
      observer: messageDetails.senderId,
      client: 'discord',
      channel: messageDetails.channelId,
      // agentId: this.agent.id, // Assuming this.agent is accessible
      // entities: messageDetails.entities,
      channelType: messageDetails.channelType,
      rawData: messageDetails.rawData,
      metadata: messageDetails.metadata || {},
      timestamp: new Date().toISOString(),
    }
  }
}

export default BasePlugin
