import { EmitterFactory, CreateMessageEvents } from '@magickml/shared-plugins'
import TypedEmitter from 'typed-emitter'
import { DISCORD_EVENTS } from '../configx'

export type DiscordMessageEvents = CreateMessageEvents<typeof DISCORD_EVENTS>

export type DiscordEmitterType = TypedEmitter<DiscordMessageEvents>

export const DiscordEmitter = new EmitterFactory<DiscordMessageEvents>(
  DISCORD_EVENTS
).getEmitter() as DiscordEmitterType
