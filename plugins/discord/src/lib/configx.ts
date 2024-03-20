import { createEventsEnum } from 'plugins/shared/src'
import { ClientEvents, Events, GatewayIntentBits, User } from 'discord.js'
import { PLUGIN_SETTINGS } from 'shared/config'
import { APIMessage, APIReaction } from 'discord-api-types/v10'
import {
  CreateCredentialsRecord,
  EventPayload,
  PluginStateType,
} from 'server/plugin'
import { PluginCredential } from 'server/credentials'

// BASE
export const discordPluginName = 'discord' as const
export const DISCORD_DEVELOPER_MODE = PLUGIN_SETTINGS.DISCORD_DEVELOPER_MODE
export const discordIntents: GatewayIntentBits[] = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessageReactions,
  GatewayIntentBits.DirectMessageReactions,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMessageTyping,
  GatewayIntentBits.DirectMessageTyping,
  GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildPresences,
  GatewayIntentBits.GuildInvites,
]

// STATE
export type DiscordAgentContext = {
  id: User['id']
  username: User['username']
  displayName: User['displayName']
  avatar: User['avatar']
  banner: User['banner']
  platform: typeof discordPluginName
}

export interface DiscordPluginState extends PluginStateType {
  enabled: boolean
  context: DiscordAgentContext
}

export const discordDefaultState: DiscordPluginState = {
  enabled: false,
  context: {
    id: '',
    username: '',
    displayName: '',
    avatar: '',
    banner: '',
    platform: discordPluginName,
  },
}

// CREDENTIALS
export const discordPluginCredentials = [
  {
    name: 'discord-token',
    serviceType: 'discord',
    credentialType: 'plugin',
    initials: 'DC',
    clientName: 'Discord Token',
    icon: '/images/icons/discord-light.svg',
    helpLink: 'https://discord.com/developers/applications',
    description: 'Used to connect to Discord',
    available: true,
    pluginName: discordPluginName,
  },
] as const satisfies ReadonlyArray<PluginCredential>

export type DiscordCredentials = CreateCredentialsRecord<
  typeof discordPluginCredentials
>

// EVENTS
export type DiscordEvents = keyof ClientEvents
export const discordEventNames: DiscordEvents[] = [
  Events.MessageCreate,
  Events.MessageReactionAdd,
]
export const DISCORD_EVENTS = createEventsEnum(discordEventNames)

type BaseEvent = {
  messageId?: string
  channelId?: string
  guildId?: string
  fail_if_not_exists?: boolean
}
export type BaseDiscordEventPayload = {
  [DISCORD_EVENTS.messageCreate]: BaseEvent & APIMessage
  [DISCORD_EVENTS.messageReactionAdd]: BaseEvent & APIReaction
}
export type DiscordEventPayload = BaseDiscordEventPayload

export type DiscordEventMetadata = Record<string, unknown> & {
  context: DiscordAgentContext | null | undefined
}

export type DiscordEvent = EventPayload<
  DiscordEventPayload[keyof DiscordEventPayload],
  DiscordEventMetadata
>

// ACTIONS
export const DISCORD_ACTIONS = createEventsEnum(['sendMessage'])

// DEPENDENCIES
export enum DISCORD_DEPENDENCIES {
  DISCORD_KEY = 'discordClient',
  DISCORD_SEND_MESSAGE = 'discordSendMessage',
  DISCORD_CONTEXT = 'discordContext',
}

// COMMANDS
export enum DISCORD_COMMANDS {}

// METHODS
export type SendMessage = <K extends keyof DiscordEventPayload>(
  content: string,
  event: EventPayload<DiscordEventPayload[K]>
) => Promise<void>
