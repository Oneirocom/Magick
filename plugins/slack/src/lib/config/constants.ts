import { createEventsEnum } from 'plugins/shared/src'
import { PLUGIN_SETTINGS } from 'shared/config'
import { type SlackEvents } from './types'

export const slackPluginName = 'slack' as const

export const slackEventNames: SlackEvents[] = ['message']

export const SLACK_EVENTS = createEventsEnum(slackEventNames)

export const SLACK_ACTIONS = createEventsEnum([
  'sendMessage',
  'sendImage',
  'sendAudio',
])

export const SLACK_KEY = 'slackClient'

export const SLACK_DEP_KEYS = {
  SLACK_KEY,
  SEND_SLACK_MESSAGE: 'sendSlackMessage',
} as const

export const SLACK_DEVELOPER_MODE = PLUGIN_SETTINGS.SLACK_DEVELOPER_MODE
