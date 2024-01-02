import Redis from 'ioredis'
import { BullQueue } from 'packages/server/communication/src'
import { EventPayload } from 'packages/server/plugin/src'

export function createService<T>(jobName: string) {
  return class Service {
    public actionQueue: BullQueue

    constructor(connection: Redis, queueName: string) {
      this.actionQueue = new BullQueue(connection)
      this.actionQueue.initialize(queueName)
    }

    async makeRequest(event: EventPayload<unknown>, ...args: T[]) {
      return await this.actionQueue.addJob(jobName, {
        actionName: 'sendMessage',
        event,
        data: args,
      })
    }
  }
}
