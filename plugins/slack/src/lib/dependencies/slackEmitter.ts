import { EventEmitter } from 'events'
import TypedEmitter from 'typed-emitter'
import { EventPayload } from 'server/plugin'
import { SLACK_MESSAGES } from '../constants'

// Define event types with payloads conforming to EventMap
type SlackMessageEvents = {
  [K in keyof typeof SLACK_MESSAGES]: (event: EventPayload) => void
} & {
  error: (error: Error) => void
}

// Typed event emitter
export type SlackEmitterType = TypedEmitter<SlackMessageEvents>

// Create a single emitter for all Slack message events
export const SlackEmitter: SlackEmitterType =
  new EventEmitter() as unknown as SlackEmitterType
