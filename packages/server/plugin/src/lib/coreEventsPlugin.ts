import Redis from 'ioredis'
import { BasePlugin, EventPayload } from './basePlugin'
import { ON_MESSAGE } from './coreEventTypes'

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
  Payload extends Partial<EventPayload> = Partial<EventPayload>,
  Data = Record<string, unknown>,
  Metadata = Record<string, unknown>
> extends BasePlugin<Payload, Data, Metadata> {
  constructor(name: string, connection: Redis) {
    super(name, connection)
    // Initialize CoreEventPlugin specific stuff if needed
  }

  /**
   * Generic event handler to send out message events to the core
   * plugin. This is used to send out events to the core plugin.
   * This will trigger off the graph event node that is listening
   * for the event.
   *
   * @param pluginPayload - The payload to send to the core plugin.
   * @example
   * const myPlugin = new CorePlugin('MyPlugin');
   * myPlugin.onMessage({ message: 'Hello World' });
   */
  onMessage(pluginPayload: Payload) {
    const event = ON_MESSAGE
    const payload = this.formatPayload(event, pluginPayload)
    this.centralEventBus.emit(event, payload)
  }
}
