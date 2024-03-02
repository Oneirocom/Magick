import {
  type PluginCredentialsType,
  type ExtractPluginCredentialNames,
  type PluginCredential,
} from 'packages/server/credentials/src'
import { discordPluginName } from '.'
import { z } from 'zod'

export const discordPluginCredentials = [
  {
    name: 'discord-token',
    serviceType: 'discord',
    credentialType: 'plugin',
    initials: 'DC',
    clientName: 'Discord Token',
    icon: 'https://discord.com/assets/f8389ca1a741a115313bede9ac02e2c0.svg',
    helpLink: 'https://discord.com/developers/applications',
    description: 'Used to connect to Discord',
    available: true,
    pluginName: discordPluginName,
  },
] as const satisfies PluginCredential[]

// export type DiscordPluginCredentials = typeof discordPluginCredentials

export type DiscordCredentialNames = ExtractPluginCredentialNames<
  typeof discordPluginCredentials
>

export type DiscordCredentialsKeys = {
  [K in DiscordCredentialNames]: string | undefined
}

export type DiscordCredentials = Record<
  DiscordCredentialNames,
  string | undefined
>

export const discordPluginCredentialsSchema = z.object({
  'discord-token': z.string(),
})

// parse but don't validate
export const parseDiscordPluginCredentials = (state: unknown) => {
  return discordPluginCredentialsSchema.safeParse(state)
}

// validate and parse
export const validateDiscordPluginCredentials = (state: unknown) => {
  return discordPluginCredentialsSchema.parse(state)
}
