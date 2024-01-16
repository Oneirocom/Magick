// onSlackMessage.ts
import { SLACK_EVENTS, pluginName } from '../../constants'
import { EventPayload } from 'packages/server/plugin/src'
import { SlackEmitterType } from '../../dependencies/slackEmitter'
import { AllMiddlewareArgs } from '@slack/bolt'
import { createEventNode } from 'plugins/shared/src'

type SlackEventProcess = (
  write: (key: string, value: any) => void,
  commit: (key: string) => void,
  event: EventPayload<AllMiddlewareArgs>
) => void

const processSlackEvent: SlackEventProcess = (write, commit, event) => {
  const { content, sender, channel } = event
  write('event', event)
  content && content.length > 0 && write('content', content)
  write('sender', sender)
  write('channel', channel)
  commit('flow')
}

const createSlackEventNode = (
  typeName: string,
  label: string,
  eventKey: keyof typeof SLACK_EVENTS,
  out?: Record<string, string>
) =>
  createEventNode<SlackEmitterType, any>({
    base: {
      typeName,
      label,
      in: {},
      out: out ?? {
        flow: 'flow',
        content: 'string',
        sender: 'string',
        channel: 'string',
        event: 'event',
      },
    },
    emitterDependencyKey: pluginName,
    process: processSlackEvent,
    event: SLACK_EVENTS[eventKey],
  })

export const onSlackMessage = createSlackEventNode(
  'slack/onMessage',
  'On Slack Message',
  SLACK_EVENTS.message
)
export const onSlackDirectMessage = createSlackEventNode(
  'slack/onDirectMessage',
  'On Slack Direct Message',
  SLACK_EVENTS.message_im
)
export const onSlackGroupMessage = createSlackEventNode(
  'slack/onGroupMessage',
  'On Slack Group Message',
  SLACK_EVENTS.message_mpim
)
export const onSlackBotMessage = createSlackEventNode(
  'slack/onBotMessage',
  'On Slack Bot Message',
  SLACK_EVENTS.bot_message
)
export const onSlackChannelJoin = createSlackEventNode(
  'slack/onChannelJoin',
  'On Slack Channel Join',
  SLACK_EVENTS.channel_join,
  {
    flow: 'flow',
    sender: 'string',
    channel: 'string',
    event: 'event',
  }
)
export const onSlackChannelLeave = createSlackEventNode(
  'slack/onChannelLeave',
  'On Slack Channel Leave',
  SLACK_EVENTS.channel_leave,
  {
    flow: 'flow',
    sender: 'string',
    channel: 'string',
    event: 'event',
  }
)
export const onSlackFileShare = createSlackEventNode(
  'slack/onFileShared',
  'On Slack File Shared',
  SLACK_EVENTS.file_share
)

export const onSlackMessageNodes = [
  onSlackMessage,
  onSlackDirectMessage,
  onSlackGroupMessage,
  onSlackBotMessage,
  onSlackChannelJoin,
  onSlackChannelLeave,
  onSlackFileShare,
]
