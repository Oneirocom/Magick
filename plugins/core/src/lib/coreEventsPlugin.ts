import { CorePlugin, ON_MESSAGE } from 'server/plugin'
import Redis from 'ioredis'

/**
 * CorePlugin handles all generic events and has its own nodes, dependencies, and values.
 */
export class CoreEventsPlugin extends CorePlugin {
  constructor(name: string, connection: Redis) {
    super(name, connection)
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

  initializeFunctionalities() {
    this.centralEventBus.on(ON_MESSAGE, this.handleMessage.bind(this))
  }

  handleMessage(payload: any) {
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
