import Redis from 'ioredis'
import { BullQueue } from 'packages/server/communication/src'
import { EventPayload } from 'packages/server/plugin/src'

export interface ActionServiceConfig<T> {
  connection: Redis
  queueName: string
  actionTypes: T
}

export class ActionService<T extends Record<string, string>> {
  private actionQueue: BullQueue

  constructor(config: ActionServiceConfig<T>) {
    this.actionQueue = new BullQueue(config.connection)
    this.actionQueue.initialize(config.queueName)

    Object.keys(config.actionTypes).forEach(actionType => {
      this[actionType] = async (event: EventPayload<any>, data: any) => {
        await this.sendAction(config.actionTypes[actionType], event, data)
      }
    })
  }

  async sendAction(actionType: string, event: EventPayload<any>, data: any) {
    await this.actionQueue.addJob(actionType, {
      actionName: actionType,
      event,
      data,
    })
  }
}

export function createActionService<T extends Record<string, string>>(
  config: ActionServiceConfig<T>
): ActionService<T> {
  return new ActionService<T>(config)
}
