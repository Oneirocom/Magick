import Redis from 'ioredis'
import { BullQueue } from 'packages/server/communication/src'
import { EventPayload } from 'packages/server/plugin/src'

export class SlackActionService {
  protected actionQueue: BullQueue

  constructor(connection: Redis, queueName: string) {
    this.actionQueue = new BullQueue(connection)
    this.actionQueue.initialize(queueName)
  }

  async sendMessage(event: EventPayload<unknown>, messageContent: any) {
    await this.actionQueue.addJob('sendSlackMessage', {
      actionName: 'sendSlackMessage',
      event,
      data: messageContent,
    })
  }
}
