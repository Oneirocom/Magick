import { PluginCredential } from 'server/credentials'

export const pluginName = 'Slack'

export const pluginCredentials: PluginCredential[] = [
  {
    name: 'slack-token',
    serviceType: 'slack',
    credentialType: 'plugin',
  },
  {
    name: 'slack-signing-secret',
    serviceType: 'slack',
    credentialType: 'plugin',
  },
  {
    name: 'slack-app-token',
    serviceType: 'slack',
    credentialType: 'plugin',
  },
]

function createEnum<T extends string>(types: T[]): { [K in T]: K } {
  return types.reduce((acc, key) => {
    acc[key] = key
    return acc
  }, Object.create(null))
}

export const SLACK_MESSAGES = createEnum([
  'app_mention',
  'message',
  'message_im',
  'message_mpim',
  'message',
  'reaction_added',
  'reaction_removed',
  'team_join',
  'channel_joined',
  'channel_left',
])
