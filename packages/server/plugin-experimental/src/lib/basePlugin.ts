import { EventEmitter } from 'events'
import Redis from 'ioredis'
import { Plugin } from 'server/plugin'
import {
  IRegistry,
  NodeDefinition,
  ValueType,
  ValueTypeMap,
  memo,
} from '@magickml/behave-graph'
import { getLogger } from 'server/logger'
import { SpellCaster } from 'server/grimoire'
import { saveGraphEvent } from 'server/core'
import {
  BasePluginStateManager,
  PluginStateManager,
  PluginStateType,
} from './state'
import { BaseCredentialsManager, PluginCredentialsManager } from './credentials'
import {
  BaseEventManager,
  EventPayload,
  PluginEventManager,
} from './events/event-manager'
import { BasePluginConfig } from './types'
import { ActionPayload, BaseActionManager } from './actions/action-manager'
import {
  BaseCommandManager,
  PluginCommandManager,
  basePluginCommands,
} from './commands/command-manager'
import { EventTypes } from 'communication'

type ValueOf<T> = T[keyof T]

export type WebhookPayload<
  T extends Record<string, unknown> = Record<string, unknown>
> = {
  agentId: string
  pluginName: string
  payload: T
}

export interface BasePluginInit {
  name: string
  agentId: string
  connection: Redis
  projectId: string
}

export abstract class BasePlugin<
  Events extends Record<string, string>,
  Actions extends Record<string, string>,
  Dependencies extends Record<string, string>,
  Commands extends Record<string, string>,
  Credentials extends Record<string, string | undefined>,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  State extends object = Record<string, unknown>
> extends Plugin {
  protected config: BasePluginConfig<Events, Actions, Dependencies, Commands>
  protected centralEventBus!: EventEmitter
  abstract nodes?: NodeDefinition[]
  abstract values?: ValueType[]
  protected agentId: string
  protected projectId: string
  abstract defaultState: PluginStateType<State>

  public connection: Redis
  public logger = getLogger()
  public eventEmitter: EventEmitter

  protected eventManager: PluginEventManager
  protected actionsManager: BaseActionManager
  protected commandManager: PluginCommandManager
  protected stateManager: PluginStateManager<State>
  protected credentialsManager: PluginCredentialsManager<Credentials>

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
  constructor({ name, agentId, connection, projectId }: BasePluginInit) {
    super({ name })
    this.config = this.getPluginConfig()
    this.agentId = agentId
    this.projectId = projectId
    this.connection = connection
    this.eventEmitter = new EventEmitter()

    this.eventManager = new BaseEventManager(this.eventEmitter)
    this.actionsManager = new BaseActionManager(agentId)
    this.commandManager = new BaseCommandManager()

    this.credentialsManager = new BaseCredentialsManager<Credentials>(
      agentId,
      name,
      projectId
    )
    this.stateManager = new BasePluginStateManager<State>(
      this.agentId,
      this.name
    )
  }

  /**
   * Abstract method to get the WebSocket plugin configuration.
   * This is a helper to avoid using the constructor.
   * @example: Discord plugin configuration.
   * @returns The WebSocket plugin configuration.
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

  // EVENTS

  /**
   * Maps registered events to a BullMQ queue.
   * Each event emission will create a job in the BullMQ queue.
   */
  mapEventsToEventBus() {
    // this.config.events.forEach(event => {
    console.log('this.eventManager.getEvents()', this.eventManager.getEvents())
    this.eventManager.getEvents().forEach(event => {
      const { eventName } = event
      this.eventEmitter.on(eventName, async payload => {
        payload.eventName = eventName
        this.logger.debug(`Sending event ${eventName} to central message bus`)
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

  defineEvents() {
    console.log('this.config.events', this.config.events)
    for (const [messageType, eventName] of Object.entries(this.config.events)) {
      this.eventManager.registerEvent({
        eventName,
        displayName: `${this.name} ${messageType}`,
      })
    }
  }

  getEvents() {
    return this.eventManager.getEvents()
  }

  // ACTIONS

  protected initializeActionHandlers() {
    this.actionsManager.getActions().forEach(action => {
      const eventName = `${this.name}:${action.actionName}`
      this.centralEventBus.on(eventName, action.handler)
    })
  }

  defineActions() {
    const handlers = this.getActionHandlers()
    console.log('ACTION handlers', handlers)
    for (const [actionName, displayName] of Object.entries(
      this.config.actions
    )) {
      console.log('ACTION registering', actionName, displayName)
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
      basePluginCommands
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

  abstract handleEnableCommand(): void
  abstract handleDisableCommand(): void
  abstract handleLinkCommand(): void
  abstract handleUnlinkCommand(): void
  abstract handleWebhookCommand(): void

  // DEPENDENCIES

  abstract getDependencies(
    spellCaster: SpellCaster
  ):
    | Record<ValueOf<Dependencies>, any>
    | Promise<Record<ValueOf<Dependencies>, any>>

  // REGISTRY

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
   * optional method to be override by plugins to provide an additional registry when needed.
   */
  provideRegistry(registry: IRegistry): IRegistry {
    return registry
  }

  async getRegistry(
    existingRegistry: IRegistry,
    spellCaster: SpellCaster
  ): Promise<IRegistry> {
    // Define the plugin-specific values, nodes, and dependencies
    const pluginValues = this.getPluginValues()
    const pluginNodes = this.getPluginNodes()
    const pluginDependencies = await this.getDependencies(spellCaster)
    pluginDependencies[this.name] = this.eventEmitter

    // Merge the plugin's registry with the existing registry
    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: { ...existingRegistry.dependencies, ...pluginDependencies },
    }

    return await this.provideRegistry(registry)
  }

  async getRegistryForNodeSpec(existingRegistry: IRegistry) {
    const pluginValues = this.getPluginValues()
    const pluginNodes = this.getPluginNodes()
    // // return a registry that has empty dependencies
    const registry = {
      values: { ...existingRegistry.values, ...pluginValues },
      nodes: { ...existingRegistry.nodes, ...pluginNodes },
      dependencies: {},
    }

    return await this.provideRegistry(registry)
  }

  // LIFECYCLE METHODS

  /**
   * Sets the enabled state of the plugin.
   * @param state The state to set the plugin to.
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

  async activate() {
    await this.beforeActivate()
    await this.setEnabled(true)
    await this.afterActivate()

    this.logger.debug(`Plugin ${this.name} activated`)
  }
  abstract beforeActivate(): Promise<void> | void
  abstract afterActivate(): Promise<void> | void

  async deactivate() {
    await this.beforeDeactivate()
    await this.setEnabled(false)
    await this.afterDeactivate()
    this.logger.debug(`Plugin ${this.name} deactivated`)
  }
  abstract beforeDeactivate(): Promise<void> | void
  abstract afterDeactivate(): Promise<void> | void

  destroy(): void {
    this.beforeDestroy()
    this.eventEmitter.removeAllListeners()
    this.afterDestroy()
    this.logger.debug(`Plugin ${this.name} destroyed.`)
  }
  abstract beforeDestroy(): void
  abstract afterDestroy(): void

  // MISC
  /**
   * Abstract method for formatting the event payload.
   * Each plugin should implement this method to format its specific event data.
   * The formatMessageEvent method can be used to format a message event.
   * @param event The event name.
   * @param details The specific details of the event.
   * @returns Formatted event payload.
   */
  abstract formatPayload(event: string, details: Payload): Payload

  /**
   * Formats to an event payload for a message.
   * @param messageDetails Details of the message to format.
   * @returns Formatted message event payload.
   */
  formatMessageEvent<Data, Metadata>(
    event,
    messageDetails: EventPayload<Data, Metadata>
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
      channelType: messageDetails.channelType,
      rawData: messageDetails.rawData,
      metadata: messageDetails.metadata || ({} as Metadata),
      data: messageDetails.data || ({} as Data),
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Generic event trigger to send out message events to the core
   * plugin. This is used to send out events to the core plugin.
   * This will trigger off the graph event node that is listening
   * for the event.
   *
   * @param pluginPayload - The payload to send to the core plugin.
   * @example
   * const myPlugin = new BasePlugin('MyPlugin');
   * myPlugin.triggerMessageReceived({ message: 'Hello World' });
   */
  triggerMessageReceived(pluginPayload: Payload) {
    const event = EventTypes.ON_MESSAGE
    const payload = this.formatPayload(event, pluginPayload)
    this.centralEventBus.emit(event, payload)
  }
}

export default BasePlugin
