import EventEmitter from 'events'
import { EventPayload, ON_MESSAGE } from 'server/plugin'
import TypedEmitter from 'typed-emitter'

type MessageEvents = {
  error: (error: Error) => void
  [ON_MESSAGE]: (event: EventPayload) => void
}

export type CoreEmitter = TypedEmitter<any>

export const coreEmitter = new EventEmitter()
