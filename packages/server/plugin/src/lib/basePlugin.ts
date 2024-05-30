import { EventEmitter } from 'events'
import Redis from 'ioredis'
import { Plugin } from './plugin'
import {
  memo,
  type IRegistry,
  type NodeDefinition,
  type ValueType,
  type ValueTypeMap,
} from '@magickml/behave-graph'
import { getLogger } from 'server/logger'
import { SpellCaster } from 'server/grimoire'
import { BaseEmitter } from './baseEmitter'
import { type PluginCredential } from 'server/credentials'
import { saveGraphEvent } from 'server/core'
import { type BasePluginConfig } from './types'

// MANAGERS
import {
  BasePluginStateManager,
  type PluginStateManager,
  type PluginStateType,
} from './state'
import {
  BaseCredentialsManager,
  type PluginCredentialsManager,
} from './credentials'
import {
  BaseCommandManager,
  basePluginCommands as expBasePluginCommands,
  type PluginCommandManager,
  type PluginCommand,
} from './commands/command-manager'
import { BaseActionManager, type ActionPayload } from './actions/action-manager'
import {
  type EventDefinition,
  type EventFormat,
  type EventPayload,
} from './events/event-manager'
import { PluginStorageManager, S3PluginStorageManager } from './storage'

import {
  AWS_SECRET_KEY,
  AWS_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} from 'shared/config'
import { Agent } from 'server/agents'

type ValueOf<T> = T[keyof T]

export type RegistryFactory = (registry?: IRegistry) => IRegistry

export type WebhookPayload<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  agentId: string
  pluginName: string
  payload: T
}

export interface BasePluginInit {
  name: string
  agent: Agent
  connection: Redis
  projectId: string
  state?: Record<string, unknown>
}

export abstract class BasePlugin<
  Events extends Record<string, string> = Record<string, string>,
  Actions extends Record<string, string> = Record<string, string>,
  Dependencies extends Record<string, string> = Record<string, string>,
  Commands extends Record<string, string> = Record<string, string>,
  Credentials extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
  PluginEvents extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  State extends object = Record<string, unknown>
> extends Plugin {
  protected config: BasePluginConfig<Events, Actions, Dependencies, Commands>
  protected events: EventDefinition[]
  protected commands: PluginCommand[] = []
  protected centralEventBus!: EventEmitter
  abstract credentials: ReadonlyArray<Readonly<PluginCredential>>

  abstract nodes?: NodeDefinition[]
  abstract values?: ValueType[]
  protected agent: Agent
  protected agentId: string
  protected projectId: string
  abstract defaultState: PluginStateType<State>

  public connection: Redis
  public logger = getLogger()
  public eventEmitter: EventEmitter
  private updateDependencyHandler?: (key: string, dependency: any) => void

  protected stateManager: PluginStateManager<State>
  protected credentialsManager: PluginCredentialsManager<Credentials>
  protected commandManager: PluginCommandManager
  protected actionsManager: BaseActionManager
  protected storageManager: PluginStorageManager

  /**
   * Returns the name of the BullMQ queue for the plugin.
   * Format: event:pluginName
   * @returns The name of the queue.
   * @example
   * const queueName = this.getQueueName();
   */
  get eventQueueName() {
    return `agent:${this.agent.id}:${this.name}:event`
  }

  /**
   * Returns the name of the BullMQ queue for the plugin's actions.
   * Format: action:pluginName
   * @returns The name of the queue.
   * @example
   * const queueName = this.getActionQueueName();
   */
  get actionQueueName() {
    return `agent:${this.agent.id}:${this.name}:action`
  }

  /**
   * Creates an instance of BasePlugin.
   * @param name The name of the plugin.
   * @example
   * const myPlugin = new BasePlugin('MyPlugin');
   */
  constructor({ name, agent, connection, projectId }: BasePluginInit) {
    super({ name })
    this.config = this.getPluginConfig()
    this.agent = agent
    this.agentId = agent?.id || ''
    this.projectId = projectId
    this.connection = connection
    this.eventEmitter = new EventEmitter()
    this.events = []

    this.credentialsManager = new BaseCredentialsManager<Credentials>(
      this.agentId,
      name,
      projectId
    )
    this.stateManager = new BasePluginStateManager<State>(
      this.agentId,
      this.name
    )

    this.commandManager = new BaseCommandManager()

    this.actionsManager = new BaseActionManager(this.agentId)

    this.storageManager = new S3PluginStorageManager(
      this.agentId,
      this.name,
      AWS_ACCESS_KEY,
      AWS_SECRET_KEY,
      AWS_REGION,
      AWS_BUCKET_NAME
    )
  }

  // CONFIG

  /**
   * Abstract method to get the plugin configuration.
   * This is a helper to avoid using the constructor.
   */
  abstract getPluginConfig(): BasePluginConfig<
    Events,
    Actions,
    Dependencies,
    Commands
  >
  /**
   * Initializes the plugin by defining events and initializing functionalities.
   */
  async init(centralEventBus: EventEmitter) {
    this.centralEventBus = centralEventBus
    this.defineEvents()
    this.defineActions()
    this.defineCommands()

    const state = await this.stateManager.ensureStateInitialized(
      this.defaultState
    )
    await this.credentialsManager.init()
    if (state?.enabled) await this.activate()

    this.mapEventsToEventBus()
    this.mapActionsToEventBus()
    this.initializeActionHandlers()
  }

  // LIFECYCLE METHODS

  /**
   * Sets the enabled state of the plugin.
   * @param enabled The enabled state to set.
   * @example
   * this.setEnabled(true);
   */
  async setEnabled(enabled: boolean) {
    const current = this.stateManager.getState() as PluginStateType<State>
    await this.stateManager.updatePluginState({
      ...current,
      enabled,
    })
  }

  /**
   * Activates the plugin, making it ready for operation.
   */
  async activate() {
    await this.beforeActivate()
    await this.setEnabled(true)
    await this.afterActivate()

    this.logger.debug(`Plugin ${this.name} activated`)
  }
  abstract beforeActivate(): Promise<void> | void
  abstract afterActivate(): Promise<void> | void

  /**
   * Deactivates the plugin, putting it into a passive state.
   */
  async deactivate() {
    await this.beforeDeactivate()
    await this.setEnabled(false)
    await this.afterDeactivate()
    this.logger.debug(`Plugin ${this.name} deactivated`)
  }
  abstract beforeDeactivate(): Promise<void> | void
  abstract afterDeactivate(): Promise<void> | void

  /**
   * Cleans up resources and performs necessary teardown tasks.
   */
  destroy(): void {
    this.beforeDestroy()
    this.eventEmitter.removeAllListeners()
    this.afterDestroy()
    this.logger.debug(`Plugin ${this.name} destroyed.`)
  }
  abstract beforeDestroy(): void
  abstract afterDestroy(): void

  // EVENTS

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

  // ACTIONS

  protected initializeActionHandlers() {
    this.actionsManager.getActions().forEach(action => {
      const eventName = `${this.name}:${action.actionName}`
      this.centralEventBus.on(eventName, action.handler)
    })
  }

  defineActions() {
    const handlers = this.getActionHandlers()

    for (const [actionName, displayName] of Object.entries(
      this.config.actions
    )) {
      if (!handlers[actionName]) {
        throw new Error(`Missing action handler for ${actionName}`)
      }
      this.actionsManager.registerAction({
        actionName,
        displayName: `${this.name} ${displayName}`,
        handler: handlers[actionName].bind(this),
      })
    }
  }

  abstract getActionHandlers(): Record<
    keyof Actions,
    (payload: ActionPayload<Payload['data'], Payload['metadata']>) => void
  >

  /**
   * Maps registered actions to the action queue.
   */
  mapActionsToEventBus() {
    this.centralEventBus.on(
      this.actionQueueName,
      this.actionsManager.handleAction.bind(this.actionsManager)
    )
  }

  // COMMANDS

  defineCommands() {
    const handlers = this.getCommandHandlers()
    for (const command of Object.entries(this.config.commands)) {
      const commandName = command[0]
      const displayName = command[1]
      const handler = handlers[commandName]
      if (!handler) {
        throw new Error(`Missing command handler for ${commandName}`)
      }
      this.commandManager.registerCommand({
        commandName,
        displayName: `${this.name} ${displayName}`,
        handler: handler.bind(this),
      })
    }

    this.defineBaseCommands()
  }

  abstract getCommandHandlers(): Record<keyof Commands, (enable: any) => void>

  getCommands = () => {
    return this.commandManager.getCommands()
  }

  /**
   * Registers the base commands for the plugin.
   */
  defineBaseCommands() {
    const { enable, disable, linkCredential, unlinkCredential, webhook } =
      expBasePluginCommands
    this.commandManager.registerCommand({
      ...linkCredential,
      handler: this.handleEnableCommand.bind(this),
    })
    this.commandManager.registerCommand({
      ...unlinkCredential,
      handler: this.handleDisableCommand.bind(this),
    })
    this.commandManager.registerCommand({
      ...enable,
      handler: this.handleLinkCommand.bind(this),
    })
    this.commandManager.registerCommand({
      ...disable,
      handler: this.handleUnlinkCommand.bind(this),
    })
    this.commandManager.registerCommand({
      ...webhook,
      handler: this.handleWebhookCommand.bind(this),
    })
  }

  abstract handleEnableCommand(payload: any): void
  abstract handleDisableCommand(payload: any): void
  abstract handleLinkCommand(payload: any): void
  abstract handleUnlinkCommand(payload: any): void
  abstract handleWebhookCommand(payload: any): void

  // DEPENDENCIES

  abstract getDependencies(
    spellCaster: SpellCaster
  ):
    | Record<ValueOf<Dependencies>, any>
    | Promise<Record<ValueOf<Dependencies>, any>>

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

        if (payload.skipSave) return

        saveGraphEvent({
          sender: payload.sender,
          observer: this.agent.id,
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
    if (!this.stateManager.getState()?.enabled) {
      console.log(`Plugin ${this.name} is not enabled.  Not emitting event.`)
      return
    }
    this.eventEmitter.emit(eventName, payload)
  }

  // REGISTRY

  /**
   * optional method to be override by plugins to provide an additional registry when needed.
   */
  provideRegistry(registry: IRegistry): IRegistry {
    return registry
  }

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
    // @ts-ignore
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
    event: string,
    messageDetails: EventFormat<Data, Metadata>
  ): EventPayload<Data, Metadata> {
    const rawData =
      typeof messageDetails.rawData === 'string'
        ? messageDetails.rawData
        : JSON.stringify(messageDetails.rawData)

    return {
      plugin: messageDetails.plugin || this.name,
      connector: this.name,
      eventName: event,
      status: messageDetails.status || 'success',
      agentId: this.agent.id,
      isPlaytest: messageDetails?.isPlaytest || false,
      spellId: messageDetails?.spellId,
      // entities: messageDetails.entities,
      metadata: messageDetails.metadata || ({} as Metadata),
      timestamp: new Date().toISOString(),
      ...messageDetails,
      rawData: rawData,
    }
  }
}

export default BasePlugin
