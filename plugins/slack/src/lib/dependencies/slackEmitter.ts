import { EventEmitter } from 'events'
import { EventPayload } from 'packages/server/plugin/src'
import TypedEmitter from 'typed-emitter'
import { ON_SLACK_MESSAGE } from '../events'

type SlackMessageEvents = {
  error: (error: Error) => void
  [ON_SLACK_MESSAGE]: (event: EventPayload) => void
}

export type SlackEmitterType = TypedEmitter<SlackMessageEvents>

export const SlackEmitter = EventEmitter
