import { EventEmitter } from 'events'
import { ActionPayload, EventPayload } from 'server/plugin'
import { getLogger } from 'server/logger'

export class CoreActionService {
  protected actionQueueName: string
  protected eventBus: EventEmitter
  protected logger = getLogger()
  protected emitAction: (payload: ActionPayload) => void

  constructor(eventBus: EventEmitter, actionQueueName: string) {
    this.eventBus = eventBus
    this.actionQueueName = actionQueueName
    this.emitAction = (payload: ActionPayload) => {
      this.eventBus.emit(this.actionQueueName, payload)
    }
  }

  async sendMessage(event: EventPayload, messageContent: any) {
    // Enqueue the message
    this.logger.trace('CORE ACTION SERVICE: Sending message')
    await this.emitAction({
      actionName: 'sendMessage',
      event,
      data: messageContent,
    })
  }

  async streamMessage(event: EventPayload, messageContent: any) {
    // Enqueue the message
    this.logger.trace('CORE ACTION SERVICE: Streaming message')
    await this.emitAction({
      actionName: 'streamMessage',
      event,
      data: messageContent,
    })
  }
}
