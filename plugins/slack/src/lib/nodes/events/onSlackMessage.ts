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

const commonProcess: SlackEventProcess = (write, commit, event) => {
  write('event', event)
  write('content', event.content)
  write('sender', event.sender)
  write('channel', event.channel)
  commit('flow')
}

const commonBase = {
    in: {},
    out: commonOut,
}

const common = {
  emitterDependencyKey: pluginName,
  process: commonProcess,
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


export const onSlackMessageNodes = [
  onSlackMessage,
  onSlackDirectMessage,
  onSlackGroupMessage,
]
