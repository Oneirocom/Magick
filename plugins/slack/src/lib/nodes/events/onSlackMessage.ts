import { SLACK_EVENTS, pluginName } from '../../constants'
import { EventPayload } from 'packages/server/plugin/src'
import { SlackEmitterType } from '../../dependencies/slackEmitter'
import { AllMiddlewareArgs } from '@slack/bolt'
import {
  createEventNode,
  CreateEventNodeInputs,
  CreateEventNodeProcess,
} from 'plugins/shared/src'

type SlackEventProcess = CreateEventNodeProcess<EventPayload<AllMiddlewareArgs>>

const commonOut: CreateEventNodeInputs<AllMiddlewareArgs>['base']['out'] = {
  flow: 'flow',
  content: 'string',
  sender: 'string',
  channel: 'string',
  event: 'event',
}

const commonBase = {
  in: {},
  out: commonOut,
}

const commonProcess: SlackEventProcess = (write, commit, event) => {
  write('event', event)
  write('content', event.content)
  write('sender', event.sender)
  write('channel', event.channel)
  commit('flow')
}

const common = {
  emitterDependencyKey: pluginName,
  process: commonProcess,
}

const channelOut: CreateEventNodeInputs<AllMiddlewareArgs>['base']['out'] = {
  flow: 'flow',
  sender: 'string',
  channel: 'string',
  event: 'event',
}

const channelBase = {
  in: {},
  out: channelOut,
}

const channelProcess: SlackEventProcess = (write, commit, event) => {
  write('event', event)
  write('sender', event.sender)
  write('channel', event.channel)
  commit('flow')
}

const channel = {
  emitterDependencyKey: pluginName,
  process: channelProcess,
}

export const onSlackMessage = createEventNode<SlackEmitterType, any>({
  base: {
    ...commonBase,
    typeName: 'slack/onMessage',
    label: 'On Slack Message',
  },
  ...common,
  event: SLACK_EVENTS.message,
})

export const onSlackDirectMessage = createEventNode<SlackEmitterType, any>({
  base: {
    ...commonBase,
    typeName: 'slack/onDirectMessage',
    label: 'On Slack Direct Message',
  },
  ...common,
  event: SLACK_EVENTS.message_im,
})

export const onSlackGroupMessage = createEventNode<SlackEmitterType, any>({
  base: {
    ...commonBase,
    typeName: 'slack/onGroupMessage',
    label: 'On Slack Group Message',
  },
  ...common,
  event: SLACK_EVENTS.message_mpim,
})

export const onSlackBotMessage = createEventNode<SlackEmitterType, any>({
  base: {
    ...commonBase,
    typeName: 'slack/onBotMessage',
    label: 'On Slack Bot Message',
  },
  ...common,
  event: SLACK_EVENTS.bot_message,
})

export const onSlackChannelJoin = createEventNode<SlackEmitterType, any>({
  base: {
    ...channelBase,
    typeName: 'slack/onChannelJoin',
    label: 'On Slack Channel Join',
  },
  ...channel,
  event: SLACK_EVENTS.channel_join,
})

export const onSlackChannelLeave = createEventNode<SlackEmitterType, any>({
  base: {
    ...channelBase,
    typeName: 'slack/onChannelLeave',
    label: 'On Slack Channel Leave',
  },
  ...channel,
  event: SLACK_EVENTS.channel_leave,
})

export const onSlackFileShare = createEventNode<SlackEmitterType, any>({
  base: {
    ...commonBase,
    typeName: 'slack/onFileShared',
    label: 'On Slack File Shared',
  },
  ...common,
  event: SLACK_EVENTS.file_share,
})

export const onSlackMessageNodes = [
  onSlackMessage,
  onSlackDirectMessage,
  onSlackGroupMessage,
  onSlackBotMessage,
  onSlackChannelJoin,
  onSlackChannelLeave,
  onSlackFileShare,
]
