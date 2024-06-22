import EventEmitter from 'events'
import { EventPayload } from 'servicesShared'
import TypedEmitter from 'typed-emitter'

type MessageEvents = {
  error: (error: Error) => void
  message: (event: EventPayload) => void
}

export type CoreEmitter = TypedEmitter<MessageEvents>

export const coreEmitter = new EventEmitter() as CoreEmitter
