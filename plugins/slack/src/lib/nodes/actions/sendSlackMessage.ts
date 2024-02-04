import { SlackClient } from '../../services/slack'
import { EventPayload } from 'server/plugin'
import { SlackEventPayload } from '../../types'
import { SocketDefinition } from '@magickml/behave-graph'
import { SLACK_KEY } from '../../constants'
import { IEventStore } from 'server/grimoire'
import { createActionNode } from 'plugins/shared/src'

type Inputs = {
  flow: SocketDefinition
  content: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

export const sendSlackMessage = createActionNode<
  Inputs,
  Outputs,
  [typeof SLACK_KEY, 'IEventStore']
>({
  label: 'Send Slack Message',
  typeName: 'slack/sendMessage',
  dependencyKeys: [SLACK_KEY, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: { [SLACK_KEY]: SlackClient; IEventStore: IEventStore },
    inputs: { content: string },
    write: (key: keyof Outputs, value: any) => void,
    commit: (key: string) => void
  ) => {
    const event =
      dependencies.IEventStore.currentEvent() as EventPayload<SlackEventPayload>

    await dependencies[SLACK_KEY].getClient().client.chat.postMessage({
      text: inputs.content,
      channel: event.channel,
    })

    commit('flow')
  },
})
