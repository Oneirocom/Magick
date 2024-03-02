import { createEventsEnum } from 'plugins/shared/src'
import { PLUGIN_SETTINGS } from 'shared/config'

export const slackPluginName = 'slack' as const

export const SLACK_EVENTS = createEventsEnum([
  'message',
  'message_im',
  'message_mpim',
  'bot_message',
  'channel_join',
  'channel_leave',
  'file_share',
  'me_message',
  'message_changed',
  'message_deleted',
  'message_replied',
])

export const SLACK_ACTIONS = createEventsEnum([
  'sendMessage',
  'sendImage',
  'sendAudio',
])

export const SLACK_KEY = 'slackClient'

export const SLACK_DEVELOPER_MODE = PLUGIN_SETTINGS.SLACK_DEVELOPER_MODE
