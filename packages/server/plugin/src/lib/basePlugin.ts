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
import { getLogger } from 'server/logger'
import { SpellCaster } from 'server/grimoire'
import { BaseEmitter } from './baseEmitter'
import { CredentialsManager, PluginCredential } from 'server/credentials'
import { saveGraphEvent } from 'server/core'
import { PluginStateManager, PluginStateType } from 'plugin-state'

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

/**
 * Interface for defining an action.
 * @property actionName - The unique name of the action, typically namespaced.
 * @property displayName - A user-friendly name for the action.
 * @property handler - The handler for the action.
 */
interface ActionDefinition {
  actionName: string
  displayName: string
  handler: (ActionPayload) => void
}

export interface ActionPayload<T = unknown, Y = unknown> {
  actionName: string
  event: EventPayload<T, Y>
  data: any
}

export type EventFormat<
  Data = Record<string, unknown>,
  Y = Record<string, unknown>
> = {
  content: string
  sender: string
  channel: string
  entities?: any[]
  rawData: unknown
  channelType: string
  observer: string
  client: string
  isPlaytest?: boolean
  spellId?: string
  data: Data
  metadata?: Y
  status?: 'success' | 'error' | 'pending' | 'unknown'
}

export type EventPayload<T = unknown, Y = unknown> = {
  connector: string
  eventName: string
  status: 'success' | 'error' | 'pending' | 'unknown'
  content: string
  sender: string
  observer: string
  client: string
  channel: string
  plugin: string
  agentId: string
  isPlaytest?: boolean
  spellId?: string
  // entities: any[]
  channelType: string
  rawData: unknown
  timestamp: string
  stateKey?: string
  runInfo?: {
    spellId: string
  }
  data: T
  metadata: Y
}

export type PluginCommand = {
  commandName: string
  displayName: string
  handler: (enable: boolean) => void
}


export interface BasePluginInit {
  name: string
  agentId: string
  connection: Redis
  projectId: string
  state?: Record<string, unknown>
}
/**
 * The `BasePlugin` class serves as an abstract foundation for creating plugins
 * within the system. It encapsulates common functionalities and structures that
 * are shared across various plugins, providing a consistent interface and lifecycle
 *  management.
 *
 * Core Principles:
 * 1. Event-Driven Architecture: Plugins can emit and respond to events. This aligns
 *    with the reactive programming model, where the flow of the program is driven by
 *    events.
 * 2. Extensibility: Through inheritance, specific plugins can extend `BasePlugin`,
 *    customizingvor enhancing the base functionality.
 * 3. Abstraction: It abstracts away common functionalities like event handling,
 *    queue management, and logging, allowing developers to focus on plugin-specific logic.
 * 4. Encapsulation: By encapsulating event and queue logic within the plugin, it maintains a
 *    separation of concerns, making the code more manageable and modular.
 *
 * Design Patterns:
 * - Template Method: The class provides a skeletal implementation with `abstract`
 *   methods like `defineEvents` and `initializeFunctionalities` that subclasses should
 *   override.
 * - Observer: Through the use of `EventEmitter`, the class follows the observer pattern,
 *   allowing subscribers to react to emitted events.
 * - Command: The emission of events can be seen as a command pattern, where an event
 *   triggers specific actions or commands.
 *
 * Strengths:
 * - Reduced Boilerplate: Common functionalities like event handling are handled by
 *   the base class, reducing redundancy in subclasses.
 * - Consistency: It enforces a consistent structure and lifecycle for plugins, making
 *   the system predictable and easier to understand.
 * - Scalability: The event-driven nature facilitates loose coupling and scalability,
 *   as new plugins can be easily integrated.
 * - Testability: With well-defined interfaces and separation of concerns,
 *   testing individual plugins becomes more straightforward.
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
 * This class should be used as a base for creating new plugins. It's not meant to be
 * instantiated directly, but to be extended by concrete plugin implementations.
 *
 * @property name - The name of the plugin.
 * @property events - An array of events the plugin can emit.
 * @property eventEmitter - The event emitter for emitting events.
 * @property eventQueue - The BullMQ queue for processing events.
 * @property enabled - The enabled state of the plugin.
 */
export abstract class BasePlugin<
  PluginEvents extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  //TODO: should this be getting passed in anywhere?
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  State extends object = Record<string, unknown>
> extends Plugin {
  protected events: EventDefinition[]
  protected actions: ActionDefinition[] = []
  protected commands: PluginCommand[] = []
  protected centralEventBus!: EventEmitter
  protected credentials: PluginCredential[] = []
  protected credentialsManager!: CredentialsManager
  abstract nodes?: NodeDefinition[]
  abstract values?: ValueType[]
  protected agentId: string
  protected projectId: string

  public connection: Redis
  public enabled: boolean = false
  public logger = getLogger()
  public eventEmitter: EventEmitter
  private updateDependencyHandler?: (key: string, dependency: any) => void

  public state: PluginStateType<State>
  protected stateManager: PluginStateManager<State>

  /**
   * Returns the name of the BullMQ queue for the plugin.
   * Format: event:pluginName
   * @returns The name of the queue.
   * @example
   * const queueName = this.getQueueName();
   */
  get eventQueueName() {
    return `agent:${this.agentId}:${this.name}:event`
  }

  /**
   * Returns the name of the BullMQ queue for the plugin's actions.
   * Format: action:pluginName
   * @returns The name of the queue.
   * @example
   * const queueName = this.getActionQueueName();
   */
  get actionQueueName() {
    return `agent:${this.agentId}:${this.name}:action`
  }

  /**
   * Creates an instance of BasePlugin.
   * @param name The name of the plugin.
   * @example
   * const myPlugin = new BasePlugin('MyPlugin');
   */
  constructor({ name, agentId, connection, projectId, state }: BasePluginInit) {
    super({ name })
    this.agentId = agentId
    this.projectId = projectId
    this.connection = connection
    this.eventEmitter = new EventEmitter()
    this.events = []
    this.commands = []
    this.credentialsManager = new CredentialsManager()
    this.stateManager = new PluginStateManager<State>(this.agentId, this.name)
    this.state = state
      ? (state as PluginStateType<State>)
      : ({} as PluginStateType<State>)
  }

  /**
   * Initializes the plugin by defining events and initializing functionalities.
   */
  init(centralEventBus: EventEmitter) {
    this.centralEventBus = centralEventBus
    this.defineEvents()
    this.defineActions()
    this.initializeFunctionalities()
    this.mapEventsToEventBus()
    this.mapActionsToEventBus()
    this.initializeBaseCommands()
  }

  initializeBaseCommands() {
    this.registerCommand({
      commandName: 'enable',
      displayName: 'Enable',
      handler: this.handleEnableCommand.bind(this),
    })

    this.registerCommand({
      commandName: 'disable',
      displayName: 'Disable',
      handler: this.handleEnableCommand.bind(this),
    })
  }

  /**
   * Maps registered events to a BullMQ queue.
   * Each event emission will create a job in the BullMQ queue.
   */
  mapEventsToEventBus() {
    this.events.forEach(event => {
      this.eventEmitter.on(event.eventName, async payload => {
        payload.eventName = event.eventName
        this.logger.debug(
          `Sending event ${event.eventName} to central message bus`
        )
        this.centralEventBus.emit(this.eventQueueName, payload)
        // await this.eventQueue.addJob(event.eventName, payload)

        saveGraphEvent({
          sender: payload.sender,
          observer: this.agentId,
          agentId: payload.agentId,
          connector: payload.connector,
          connectorData: JSON.stringify(payload.data),
          content: payload.content,
          eventType: payload.eventName,
          event: payload,
        })
      })
    })
  }

  /**
   * Maps registered actions to the action queue.
   */
  mapActionsToEventBus() {
    this.centralEventBus.on(this.actionQueueName, this.handleAction.bind(this))
  }

  /**
   * Handles an action from the action queue.
   * @param job The job to handle.
   */
  protected async handleAction(data: ActionPayload) {
    this.logger.trace(`Handling action ${data.actionName}`)
    const action = this.actions.find(
      action => action.actionName === data.actionName
    )
    if (!action) return
    this.logger.trace(`Action ${data.actionName} found.  Handling...`)
    await action.handler(data as ActionPayload)

    // const { actionName, event } = data
    saveGraphEvent({
      sender: this.agentId,
      // we are assuming here that the observer of this action is the
      //  original sender.  We may be wrong.
      observer: data.event.sender,
      agentId: this.agentId,
      connector: data.event.connector,
      connectorData: JSON.stringify(data.event.data),
      content: data.data.content,
      eventType: data.actionName,
      event: data.event as EventPayload,
    })
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
   * optional method to be override by plugins to provide an additional registry when needed.
   */
  provideRegistry(registry: IRegistry): IRegistry {
    return registry
  }

  abstract getDependencies(spellCaster: SpellCaster): Record<string, any>

  /**
   * Returns a registry object merged with the plugin's specific registry.
   * @param existingRegistry An existing registry to merge with the plugin's registry.
   * @returns A merged registry object.
   */
  async getRegistry(
    existingRegistry: IRegistry,
    spellCaster: SpellCaster
  ): Promise<IRegistry> {
    // Define the plugin-specific values, nodes, and dependencies
    const pluginValues = await this.getPluginValues()
    const pluginNodes = await this.getPluginNodes()
    const pluginDependencies = await this.getDependencies(spellCaster)
    pluginDependencies[this.name] = new BaseEmitter<PluginEvents>()

    // Merge the plugin's registry with the existing registry
    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: { ...existingRegistry.dependencies, ...pluginDependencies },
    }

    return await this.provideRegistry(registry)
  }

  async getRegistryForNodeSpec(existingRegistry: IRegistry) {
    const pluginValues = await this.getPluginValues()
    const pluginNodes = await this.getPluginNodes()
    // // return a registry that has empty dependencies
    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: {},
    }

    return await this.provideRegistry(registry)
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
   * Registers an action with the plugin.
   * @param action The action definition to register.
   * @example
   * this.registerAction({
   *   actionName: 'myAction',
   *   displayName: 'My Action',
   *   handler: this.handleMyAction.bind(this)
   * });
   */
  registerAction(action: ActionDefinition) {
    this.actions.push(action)
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
   * Abstract method to be implemented by plugins to define their actions.
   * @example
   * defineActions() {
   *  this.registerAction({
   *   actionName: 'myAction',
   *   displayName: 'My Action',
   *   handler: this.handleMyAction.bind(this)
   * });
   */
  abstract defineActions(): void

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
      plugin: this.name,
      connector: this.name,
      client: messageDetails.client,
      eventName: event,
      status: messageDetails.status || 'success',
      content: messageDetails.content,
      sender: messageDetails.sender,
      observer: messageDetails.observer,
      channel: messageDetails.channel,
      agentId: this.agentId,
      isPlaytest: messageDetails?.isPlaytest || false,
      spellId: messageDetails?.spellId,
      // entities: messageDetails.entities,
      channelType: messageDetails.channelType,
      rawData: messageDetails.rawData,
      metadata: messageDetails.metadata || ({} as Metadata),
      data: messageDetails.data || ({} as Data),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Sets the credentials for the plugin.
   * @param newCredentials Array of credentials to set.
   */
  setCredentials(newCredentials: PluginCredential[]) {
    this.credentials = newCredentials
  }

  /**
   * Sets the handler function for updating dependencies in the spell caster.
   * @param handler The dependency update handler function.
   */
  setUpdateDependencyHandler(handler: (key: string, dependency: any) => void) {
    this.updateDependencyHandler = handler
  }

  /**
   * Requests an update of a dependency in the spell caster.
   * @param key The key of the dependency to update.
   * @param dependency The new dependency object.
   */
  updateDependency(key: string, dependency: any) {
    if (this.updateDependencyHandler) {
      this.updateDependencyHandler(key, dependency)
    } else {
      throw new Error('Dependency update handler is not set.')
    }
  }

  /**
   * Registers a command with the plugin.
   * @param command The command definition to register.
   * @example
   * this.registerCommand({
   *   commandName: 'enable',
   *   displayName: 'Enable',
   *   handler: this.handleEnableCommand.bind(this)
   * });
   */
  registerCommand(command: PluginCommand) {
    this.commands.push(command)
  }

  /**
   * Returns the list of registered commands.
   * @returns An array of PluginCommand objects.
   * @example
   * const commands = this.getCommands();
   */
  getCommands(): Record<string, PluginCommand['handler']> {
    // reduce over command array to make object iof name and handler
    return this.commands.reduce((acc, command) => {
      acc[command.commandName] = command.handler
      return acc
    }, {} as Record<string, PluginCommand['handler']>)
  }

  /**
   * Method to handle enable/disable commands for the plugin.
   * @param enable - Boolean indicating whether to enable or disable the plugin.
   */
  handleEnableCommand(enable: boolean): void {
    if (enable) {
      this.activate()
    } else {
      this.deactivate()
    }
  }

  // /**
  //  * Method to get the current status of the plugin.
  //  * @returns The status of the plugin (enabled/disabled).
  //  */
  // getStatus(): boolean {
  //   return this.enabled
  // }

  async getCredential(
    name: string,
    serviceType?: string | undefined
  ): Promise<string | undefined> {
    try {
      return await this.credentialsManager.retrieveAgentCredentials(
        this.agentId,
        name,
        serviceType
      )
    } catch (error) {
      this.logger.error(`Error retrieving credential '${name}': ${error}`)
      return
    }
  }

  /**
   * Initializes the plugin state by fetching it from the database or setting it to a default value.
   * This should be called during the plugin's initialization process.
   */
  protected async initializePluginState(defaultState?: State): Promise<void> {
    this.state = await this.stateManager.getPluginState(defaultState)
  }

  /**
   * Updates the plugin state both in-memory and in the database.
   * @param newState The new state to set.
   */
  protected async updatePluginState(newState: State): Promise<void> {
    await this.stateManager.updatePluginState(newState)
    // After updating the state in the database, update the in-memory state.
    this.state = newState
  }
}

export default BasePlugin
