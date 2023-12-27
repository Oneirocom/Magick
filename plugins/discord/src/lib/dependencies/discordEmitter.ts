import { EventEmitter } from 'events'
import TypedEmitter from 'typed-emitter'
import { EventPayload } from 'packages/server/plugin/src'
import { DISCORD_MESSAGES } from '../constants'

// Define event types with payloads conforming to EventMap
type DiscordMessageEvents = {
  [K in keyof typeof DISCORD_MESSAGES]: (event: EventPayload) => void
} & {
  error: (error: Error) => void
}

// Typed event emitter
export type DiscordEmitterType = TypedEmitter<DiscordMessageEvents>

// Create a single emitter for all Discord message events
export const DiscordEmitter: DiscordEmitterType =
  new EventEmitter() as unknown as DiscordEmitterType
