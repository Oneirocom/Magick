import { EventEmitter } from 'events'
import Redis from 'ioredis'
import { BullQueue } from 'server/communication'
import { ActionPayload, EventPayload } from 'server/plugin'

export class CoreActionService {
  protected queueName: string
  protected eventBus: EventEmitter
  protected emitEvent: (eventName: string, payload: ActionPayload) => void

  constructor(eventBus: EventEmitter, queueName: string) {
    this.eventBus = eventBus
    this.queueName = queueName
    this.emitEvent = (eventName: string, payload: ActionPayload) => {
      this.eventBus.emit(eventName, payload)
    }
  }

  async sendMessage(event: EventPayload, messageContent: any) {
    // Enqueue the message
    await this.emitEvent('sendMessage', {
      actionName: 'sendMessage',
      event,
      data: messageContent,
    })
  }
}
