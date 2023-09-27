import { EventEmitter } from 'events'

export abstract class PubSub extends EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async publish(channel: string, message: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async subscribe(channel: string, callback: Function): Promise<void> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async unsubscribe(channel: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patternSubscribe(pattern: string, callback: Function): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
