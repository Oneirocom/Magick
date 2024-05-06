import { EventEmitter } from 'events'

export type EventFormat<
  Data = Record<string, unknown>,
  Y = Record<string, unknown>
> = {
  plugin?: string
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

export type EventPayload<T = any, Y = any> = {
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
  skipSave?: boolean
  // entities: any[]
  channelType: string
  rawData: string
  timestamp: string
  stateKey?: string
  runInfo?: {
    spellId: string
  }
  data: T
  metadata: Y
}

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
