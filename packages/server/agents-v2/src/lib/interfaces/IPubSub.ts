export interface IPubSub {
  initialize(): Promise<void>
  publish(channel: string, message: string | object): Promise<void>
  subscribe<D = any>(
    channel: any,
    callback: (message: D, channel: any) => void
  ): Promise<void>
  unsubscribe(channel: string): Promise<void>
  patternSubscribe(
    pattern: string,
    callback: (message: any, channel: string) => void
  ): Promise<void>
  patternUnsubscribe(pattern: string): Promise<void>
  removeCallback(channel: string, callback: Function): void
  removePatternCallback(pattern: string, callback: Function): void
  close(): void
}
