import { inject, injectable } from 'inversify'
import { EventPayload } from '../interfaces/IEvent'
import { IEventRouter } from '../interfaces/IEventRouter'
import { TYPES } from './dependency.config'
import { Agent } from '../Agent'

// Implementation of EventRouter
@injectable()
export class EventRouter implements IEventRouter {
  private channelHandlers: Map<
    string,
    (eventName: string, data: EventPayload) => Promise<void>
  > = new Map()

  constructor(@inject(TYPES.Agent) private agent: Agent) {
    this.setupGlobalEventListener()
  }

  private setupGlobalEventListener(): void {
    this.agent.onAny((event: any) => {
      if (event.channelId && event.eventName && event.data)
        this.routeEvent(event.channelId, event.eventName, event.data)
    })
  }

  registerChannel(
    channelId: string,
    eventHandler: (eventName: string, data: EventPayload) => Promise<void>
  ): void {
    this.channelHandlers.set(channelId, eventHandler)
  }

  unregisterChannel(channelId: string): void {
    this.channelHandlers.delete(channelId)
  }

  async routeEvent(
    channelId: string,
    eventName: string,
    data: EventPayload
  ): Promise<void> {
    const handler = this.channelHandlers.get(channelId)
    if (handler) {
      await handler(eventName, data)
    } else {
      console.warn(`No handler registered for channel ${channelId}`)
    }
  }
}
