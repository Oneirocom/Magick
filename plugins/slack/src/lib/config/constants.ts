import { createEventsEnum } from 'plugins/shared/src'
import { PLUGIN_SETTINGS } from 'shared/config'
import { type SlackEvents } from './types'

export const slackPluginName = 'slack' as const

export const slackEventNames: SlackEvents[] = [
  'message',
  'member_joined_channel',
  'member_left_channel',
  'file_shared',
  'reaction_added',
]
export const SLACK_EVENTS = createEventsEnum(slackEventNames)

export const SLACK_ACTIONS = createEventsEnum([
  'sendMessage',
  'sendImage',
  'sendAudio',
])

export const SLACK_KEY = 'slackClient'

export const SLACK_DEP_KEYS = {
  SLACK_KEY,
} as const

export const SLACK_DEVELOPER_MODE = PLUGIN_SETTINGS.SLACK_DEVELOPER_MODE
