import Redis from 'ioredis'
import { BullQueue } from 'server/communication'
import { EventPayload } from 'server/plugin'

export class CoreActionService {
  protected actionQueue: BullQueue

  constructor(connection: Redis, queueName: string) {
    this.actionQueue = new BullQueue(connection)
    this.actionQueue.initialize(queueName)
  }

  async sendMessage(event: EventPayload<unknown>, messageContent: any) {
    // Enqueue the message
    await this.actionQueue.addJob('sendMessage', {
      actionName: 'sendMessage',
      event,
      data: messageContent,
    })
  }
}
