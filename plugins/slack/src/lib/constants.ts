import { createEventsEnum } from 'plugins/factory'
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

export const SLACK_EVENTS = createEventsEnum([
  'message',
  'message_im',
  'message_mpim',
])

export const SLACK_ACTIONS = createEventsEnum([
  'sendMessage',
  'sendImage',
  'generateImage',
])

export const SLACK_KEY = 'slackClient'

export const SLACK_DEVELOPER_MODE = false
