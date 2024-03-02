import { createEventsEnum } from 'plugins/shared/src'
import { Events } from 'discord.js'
import { type ClientEvents } from 'discord.js'
import { APIMessage, APIReaction } from 'discord-api-types/v10'

export const discordPluginName = 'discord' as const

export type DiscordEvents = keyof ClientEvents

type BaseEvent = {
  messageId?: string
  channelId?: string
  guildId?: string
  fail_if_not_exists?: boolean
}

export type BaseEventPayload = {
  [DISCORD_EVENTS.messageCreate]: BaseEvent & APIMessage
  [DISCORD_EVENTS.messageReactionAdd]: BaseEvent & APIReaction
}

export type DiscordEventPayload = BaseEventPayload

export const discordEventNames: DiscordEvents[] = [
  Events.MessageCreate,
  Events.MessageReactionAdd,
]

export const DISCORD_EVENTS = createEventsEnum(discordEventNames)

export const DISCORD_ACTIONS = createEventsEnum([
  'sendMessage',
  'sendImage',
  'sendAudio',
])

export const DISCORD_KEY = 'discordClient' as const

export const DISCORD_DEVELOPER_MODE = false

export * from './credentials'
export * from './state'
export * from './commands'
