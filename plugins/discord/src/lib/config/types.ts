import { type ClientEvents } from 'discord.js'
import { APIMessage, APIReaction } from 'discord-api-types/v10'
import { DISCORD_EVENTS } from './constants'

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
