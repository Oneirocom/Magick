import Redis from 'ioredis'
import { BasePlugin, EventPayload } from './basePlugin'
import EventEmitter from 'events'
import { EventTypes } from 'communication'
import { PluginStateType } from 'plugin-state'
import { PluginCredentialsType } from 'server/credentials'

/**
 * CorePlugin is the base class for all plugins that are used to
 * extend the core functionality of the server. This class is
 * responsible for handling all generic events and relays them up to a core event plugin which provides a set of nodes, dependencies, and values.
 * @example
 * class MyPlugin extends CorePlugin {
 *  constructor(name: string, connection: Redis) {
 *   super(name, connection);
 *  }
 * }
 */
export abstract class CoreEventsPlugin<
  Events extends Record<string, string>,
  Actions extends Record<string, string>,
  Dependencies extends Record<string, string>,
  Commands extends Record<string, string>,
  Credentials extends Record<string, string | undefined>,
  PluginEvents extends Record<string, (...args: any[]) => void> = Record<
    string,
    (...args: any[]) => void
  >,
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>,
  State extends PluginStateType = PluginStateType
> extends BasePlugin<
  Events,
  Actions,
  Dependencies,
  Commands,
  Credentials,
  PluginEvents,
  Payload,
  Data,
  Metadata,
  State
> {
  constructor({
    name,
    connection,
    agentId,
    projectId,
  }: {
    name: string
    connection: Redis
    agentId: string
    projectId: string
  }) {
    super({ name, connection, agentId, projectId })
    // Initialize CoreEventPlugin specific stuff if needed
  }

  override async init(centralEventBus: EventEmitter) {
    super.init(centralEventBus)
    // this.initializeActionHandlers()
    // Initialize CoreEventPlugin specific stuff if needed
  }

  /**
   * Initializes the action handlers for the plugin. This will
   * listen for the action events and then call the handler
   * function for the action.  Hooks into the central event bus
   * to listen for the events. This is called automatically
   * when the plugin is initialized. This makes all of the
   * actions available to the central event bus if needed.
   */
  // private initializeActionHandlers() {
  //   this.actions.forEach(action => {
  //     const eventName = `${this.name}:${action.actionName}`
  //     this.centralEventBus.on(eventName, action.handler)
  //   })
  // }

  /**
   * Generic event trigger to send out message events to the core
   * plugin. This is used to send out events to the core plugin.
   * This will trigger off the graph event node that is listening
   * for the event.
   *
   * @param pluginPayload - The payload to send to the core plugin.
   * @example
   * const myPlugin = new CorePlugin('MyPlugin');
   * myPlugin.triggerMessageReceived({ message: 'Hello World' });
   */
  triggerMessageReceived(pluginPayload: Payload) {
    const event = EventTypes.ON_MESSAGE
    const payload = this.formatPayload(event, pluginPayload)
    this.centralEventBus.emit(event, payload)
  }
}

// helpers types and abstract class so that i can just pass State in easier
export type DefaultPluginEvents = Record<string, (...args: any[]) => void>
export type DefaultPluginPayload = Partial<EventPayload>
export type DefaultPluginData = Record<string, unknown>
export type DefaultPluginMetadata = Record<string, unknown>

export abstract class CoreEventsPluginWithDefaultTypes<
  Events extends Record<string, string>,
  Actions extends Record<string, string>,
  Dependencies extends Record<string, string>,
  Commands extends Record<string, string>,
  Credentials extends Record<string, string | undefined>,
  State extends PluginStateType
> extends CoreEventsPlugin<
  Events,
  Actions,
  Dependencies,
  Commands,
  Credentials,
  DefaultPluginEvents,
  DefaultPluginPayload,
  DefaultPluginData,
  DefaultPluginMetadata,
  State
> {}
