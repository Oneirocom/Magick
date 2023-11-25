import EventEmitter from 'events'
import { EventPayload } from 'server/plugin'
import TypedEmitter from 'typed-emitter'

type MessageEvents = {
  error: (error: Error) => void
  message: (event: EventPayload) => void
}

export type CoreEmitter = TypedEmitter<MessageEvents>

export const coreEmitter = new EventEmitter() as CoreEmitter
