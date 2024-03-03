import { createEventsEnum } from 'plugins/shared/src'
import { Events } from 'discord.js'
import { DiscordEvents } from './types'
import { PLUGIN_SETTINGS } from 'shared/config'

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

export const DISCORD_DEP_KEYS = {
  DISCORD_KEY: 'discordClient',
  DISCORD_SEND_MESSAGE: 'discordSendMessage',
  DISCORD_CONTEXT: 'discordContext',
} as const

export const DISCORD_KEY = 'discordClient' as const

export const DISCORD_DEVELOPER_MODE = PLUGIN_SETTINGS.DISCORD_DEVELOPER_MODE
