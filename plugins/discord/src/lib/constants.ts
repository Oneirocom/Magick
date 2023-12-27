import { PluginCredential } from 'packages/server/credentials/src'

export const pluginName = 'Discord'

export const pluginCredentials: PluginCredential[] = [
  {
    name: 'discord-token',
    serviceType: 'discord',
    credentialType: 'plugin',
  },
]

function createEnum<T extends string>(types: T[]): { [K in T]: K } {
  return types.reduce((acc, key) => {
    acc[key] = key
    return acc
  }, Object.create(null))
}

export const DISCORD_MESSAGES = createEnum([
  'message',
  'messageCreate',
  'messageDelete',
  'messageUpdate',
])
