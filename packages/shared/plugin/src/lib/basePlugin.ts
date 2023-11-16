import { EventEmitter } from 'events'
import { BullQueue } from 'server/core'
import { Plugin } from './plugin'
import { Agent } from 'server/agents'

/**
 * Interface for defining an event.
 * @property eventName - The unique name of the event, typically namespaced.
 * @property displayName - A user-friendly name for the event.
 * @property payloadType - The type of data the event carries.
 */
interface EventDefinition {
  eventName: string
  displayName: string
  payloadType: any
}

export type EventFormat = {
  content: string
  senderId: string
  channelId: string
  entities?: any[]
  rawData: unknown
  channelType: string
  observer: string
  status?: 'success' | 'error' | 'pending' | 'unknown'
}

/**
 * Abstract base class for plugins.
 * @property name - The name of the plugin.
 * @property events - An array of events the plugin can emit.
 * @property eventEmitter - The event emitter for emitting events.
 */
export abstract class BasePlugin extends Plugin {
  protected events: EventDefinition[]
  protected eventEmitter: EventEmitter
  protected eventQueue: BullQueue
  protected enabled: boolean = false

  /**
   * Creates an instance of BasePlugin.
   * @param name The name of the plugin.
   * @example
   * const myPlugin = new BasePlugin('MyPlugin');
   */
  constructor(name: string, eventQueue: BullQueue) {
    super({ name })
    this.eventEmitter = new EventEmitter()
    this.eventQueue = eventQueue
    this.events = []
    this.defineEvents()
    this.initializeFunctionalities()
  }

  /**
   * Emits an event with the given name and payload.
   * @param eventName The name of the event to emit.
   * @param payload The payload of the event.
   * @example
   * this.emitEvent('myEvent', { data: 'example' });
   */
  protected emitEvent(eventName: string, payload: any) {
    if (!this.enabled) return
    this.eventEmitter.emit(eventName, payload)
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
        await this.eventQueue.addJob(namespacedEventName, payload)
      })
    })
  }

  /**
   * Formats to an event payload for a message.
   * @param messageDetails Details of the message to format.
   * @returns Formatted message event payload.
   */
  formatMessageEvent(event, messageDetails: EventFormat) {
    return {
      connector: this.name,
      event,
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
      timestamp: new Date().toISOString(),
    }
  }
}

export default BasePlugin
