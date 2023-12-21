import EventEmitter from 'events'
import TypedEmitter from 'typed-emitter'

// Define the interface for the default events
export interface DefaultEvents {
  error: (error: Error) => void
  [key: string]: (...args: any[]) => void
}

export class BaseEmitter<
  EmitterEvents extends Record<string, (...args: any[]) => void> = DefaultEvents
> {
  private eventEmitter: TypedEmitter<EmitterEvents>

  constructor() {
    this.eventEmitter = new EventEmitter() as TypedEmitter<EmitterEvents>
  }

  emit<K extends keyof EmitterEvents>(
    event: K,
    ...args: Parameters<EmitterEvents[K]>
  ): boolean {
    return this.eventEmitter.emit(event, ...args)
  }

  on<K extends keyof EmitterEvents>(
    event: K,
    listener: EmitterEvents[K]
  ): this {
    this.eventEmitter.on(event, listener)
    return this
  }

  removeListener<K extends keyof EmitterEvents>(
    event: K,
    listener: EmitterEvents[K]
  ): this {
    this.eventEmitter.removeListener(event, listener)
    return this
  }

  removeAllListeners<K extends keyof EmitterEvents>(event?: K): this {
    this.eventEmitter.removeAllListeners(event)
    return this
  }
}
