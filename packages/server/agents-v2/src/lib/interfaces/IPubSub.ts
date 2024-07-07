export interface IPubSub {
  initialize(): Promise<void>
  publish(channel: string, message: string | object): Promise<void>
  subscribe(channel: string, callback: (message: any) => void): Promise<void>
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
