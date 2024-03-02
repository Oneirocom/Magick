import { type ClientEvents, type User } from 'discord.js'
import { DISCORD_EVENTS } from './constants'
import { APIMessage, APIReaction } from 'discord-api-types/v10'
import type { PluginStateType } from 'plugin-state'

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

export type DiscordCredentials = string | undefined

export type DiscordAgentContext = {
  id: User['id']
  username: User['username']
  displayName: User['displayName']
  avatar: User['avatar']
  banner: User['banner']
}
export interface DiscordPluginState extends PluginStateType {
  enabled: boolean
  context: DiscordAgentContext
}
