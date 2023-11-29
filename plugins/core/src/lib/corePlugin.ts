import { CoreEventsPlugin, EventPayload, ON_MESSAGE } from 'server/plugin'
import { MessageEvent } from './nodes/events/messageEvent'
import Redis from 'ioredis'
import { coreEmitter } from './dependencies/coreEmitter'
import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'

const pluginName = 'core'

/**
 * CorePlugin handles all generic events and has its own nodes, dependencies, and values.
 */
export class CorePlugin extends CoreEventsPlugin {
  nodes = [MessageEvent]

  values = []

  dependencies = {
    pluginName: coreEmitter,
  }

  constructor(connection: Redis, agentId: string) {
    super(pluginName, connection, agentId)
  }

  /**
   * Defines the events that the plugin will listen for.
   */
  defineEvents() {
    // Define events here
    this.registerEvent({
      eventName: ON_MESSAGE,
      displayName: 'Message Received',
    })
  }

  /**
   * Provides the core registry from Behave Graph. Wraps our existing nodes and values.
   * @param registry The registry to provide.
   */
  override provideRegistry(registry: IRegistry): IRegistry {
    return registerCoreProfile(registry)
  }

  initializeFunctionalities() {
    this.centralEventBus.on(ON_MESSAGE, this.handleMessage.bind(this))
  }

  handleMessage(payload: EventPayload) {
    this.emitEvent(ON_MESSAGE, payload)
  }

  /**
   * We dont need to format the payload for this plugin. This is
   * because the payload is already formatted in the core plugin.
   * @param event
   * @param payload
   */
  formatPayload(event, payload) {
    return payload
  }
}
