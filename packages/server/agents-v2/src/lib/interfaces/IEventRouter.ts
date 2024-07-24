import { EventPayload } from './IEvent'

export interface IEventRouter {
  registerChannel(
    channelId: string,
    eventHandler: (eventName: string, data: EventPayload) => Promise<void>
  ): void
  unregisterChannel(channelId: string): void
  routeEvent(channelId: string, eventName: string, data: EventPayload): void
}
