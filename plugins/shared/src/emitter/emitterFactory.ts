import { EventEmitter } from 'events'
import { EventPayload } from 'packages/server/plugin/src'
import TypedEmitter, { type EventMap } from 'typed-emitter'

export type CreateMessageEvents<T> = {
  [K in keyof T]: (event: EventPayload) => void
} & {
  error: (error: Error) => void
}

class EmitterFactory<T extends EventMap> {
  private eventEmitter: TypedEmitter<T>

  constructor(
    eventTypes: Record<string, unknown>,
    eventHandlers: Partial<T> = {}
  ) {
    this.eventEmitter = new EventEmitter() as TypedEmitter<T>
    this.initializeEvents(eventTypes, eventHandlers)
  }

  private initializeEvents(
    eventTypes: Record<string, unknown>,
    eventHandlers: Partial<T>
  ): void {
    Object.keys(eventTypes).forEach(eventKey => {
      const handler = eventHandlers[eventKey]
      if (handler) {
        this.eventEmitter.on(eventKey as any, handler)
      }
    })
  }

  public getEmitter(): TypedEmitter<T> {
    return this.eventEmitter
  }
}

export { EmitterFactory }
