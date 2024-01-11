import { createEventsEnum } from 'plugins/shared'
import { PluginCredential } from 'server/credentials'

export const pluginName = 'Slack'

export const pluginCredentials: PluginCredential[] = [
  {
    name: 'slack-token',
    serviceType: 'slack',
    credentialType: 'plugin',
    initials: 'SL',
    clientName: 'Slack Token',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    helpLink: 'https://api.slack.com/apps/',
    description: 'Used to  recieve events from Slack',
  },
  {
    name: 'slack-signing-secret',
    serviceType: 'slack',
    credentialType: 'plugin',
    initials: 'SL',
    clientName: 'Slack Signing Secret',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    helpLink: 'https://api.slack.com/apps/',
    description: 'Used to verify requests from Slack',
  },
  {
    name: 'slack-app-token',
    serviceType: 'slack',
    credentialType: 'plugin',
    initials: 'SL',
    clientName: 'Slack App Token',
    icon: 'https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png',
    helpLink: 'https://api.slack.com/apps/',
    description: 'Used to send messages to Slack',
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
  'generateSpeech',
  'sendAudio',
])

export const SLACK_KEY = 'slackClient'

export const SLACK_DEVELOPER_MODE = false
