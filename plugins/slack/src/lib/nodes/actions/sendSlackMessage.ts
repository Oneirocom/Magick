import {
  type SlackEventPayload,
  SLACK_DEP_KEYS,
  SendSlackMessage,
} from '../../config'
import { SocketDefinition } from '@magickml/behave-graph'
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
  [typeof SLACK_DEP_KEYS.SEND_SLACK_MESSAGE, 'IEventStore']
>({
  label: 'Send Slack Message',
  typeName: 'slack/sendMessage',
  dependencyKeys: [SLACK_DEP_KEYS.SEND_SLACK_MESSAGE, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: {
      [SLACK_DEP_KEYS.SEND_SLACK_MESSAGE]: SendSlackMessage
      IEventStore: IEventStore
    },
    inputs: { content: string },
    write: (key: keyof Outputs, value: any) => void,
    commit: (key: string) => void
  ) => {
    const event = dependencies.IEventStore.currentEvent() as SlackEventPayload

    const sendDiscordMessage = dependencies[
      SLACK_DEP_KEYS.SEND_SLACK_MESSAGE
    ] as SendSlackMessage

    await sendDiscordMessage(inputs.content, event.channel)

    await commit('flow')
  },
})
