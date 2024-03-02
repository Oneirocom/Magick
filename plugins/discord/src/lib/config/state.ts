import type { PluginStateType } from 'plugin-state'
import type { User } from 'discord.js'
import { z } from 'zod'

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

export const discordDefaultState: DiscordPluginState = {
  enabled: false,
  context: {
    id: '',
    username: '',
    displayName: '',
    avatar: '',
    banner: '',
  },
}

export const discordPluginStateSchema = z.object({
  enabled: z.boolean(),
  context: z.object({
    id: z.string(),
    username: z.string(),
    displayName: z.string(),
    avatar: z.string(),
    banner: z.string(),
  }),
})

// parse but don't validate
export const parseDiscordPluginState = (state: unknown) => {
  return discordPluginStateSchema.safeParse(state)
}

// validate and parse
export const validateDiscordPluginState = (state: unknown) => {
  return discordPluginStateSchema.parse(state)
}
