export interface IEventRouter {
  registerChannel(channelId: string): void
  unregisterChannel(channelId: string): void
  routeEvent(channelId: string, eventName: string, data: any): void
}
