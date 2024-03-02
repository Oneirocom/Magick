import { createEventsEnum } from 'plugins/shared/src'
import { Events } from 'discord.js'
import { DiscordEvents } from './types'

export const discordPluginName = 'discord' as const

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
