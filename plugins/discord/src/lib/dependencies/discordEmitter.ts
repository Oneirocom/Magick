import { EmitterFactory, CreateMessageEvents } from 'plugins/shared/src'
import TypedEmitter from 'typed-emitter'
import { DISCORD_EVENTS } from '../constants'

export type DiscordMessageEvents = CreateMessageEvents<typeof DISCORD_EVENTS>

export type DiscordEmitterType = TypedEmitter<DiscordMessageEvents>

export const DiscordEmitter = new EmitterFactory<DiscordMessageEvents>(
  DISCORD_EVENTS
).getEmitter() as DiscordEmitterType
