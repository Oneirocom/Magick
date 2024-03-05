import { type ClientEvents } from 'discord.js'
import { type APIMessage, type APIReaction } from 'discord-api-types/v10'
import { DISCORD_EVENTS } from './constants'
import { type EventPayload } from 'server/plugin'
import { type DiscordAgentContext } from './state'

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

export type SendMessage = <K extends keyof DiscordEventPayload>(
  content: string,
  event: EventPayload<DiscordEventPayload[K]>
) => Promise<void>

export type DiscordEventMetadata = Record<string, unknown> & {
  context: DiscordAgentContext | null | undefined
}

export type DiscordEvent = EventPayload<
  DiscordEventPayload[keyof DiscordEventPayload],
  DiscordEventMetadata
>
