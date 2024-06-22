import { EventEmitter } from 'events'
import { EventPayload } from 'servicesShared'

/**
 * Interface for defining an event.
 * @property eventName - The unique name of the event, typically namespaced.
 * @property displayName - A user-friendly name for the event.
 * @property payloadType - The type of data the event carries.
 */
export interface EventDefinition {
  eventName: string
  displayName: string
}

export abstract class PluginEventManager {
  protected events: EventDefinition[] = []
  protected emitter: EventEmitter

  constructor(eventEmitter: EventEmitter) {
    this.emitter = eventEmitter
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
  abstract registerEvent(event: EventDefinition): void

  /**
   * Returns the list of registered events.
   * @returns An array of EventDefinition objects.
   * @example
   * const events = this.getEvents();
   */
  abstract getEvents(): EventDefinition[]

  /**
   * Emits an event with the given name and payload.
   * @param eventName The name of the event to emit.
   * @param payload The payload of the event.
   * @example
   * this.emitEvent('myEvent', { data: 'example' });
   */
  abstract emitEvent(eventName: string, payload: EventPayload): void
}

export class BaseEventManager extends PluginEventManager {
  constructor(eventEmitter: EventEmitter) {
    super(eventEmitter)
  }

  registerEvent(event: EventDefinition): void {
    this.events.push(event)
  }

  getEvents(): EventDefinition[] {
    return this.events
  }

  emitEvent(eventName: string, payload: EventPayload): void {
    this.emitter.emit(eventName, payload)
  }
}
