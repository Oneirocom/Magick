import {
  type SlackEventPayload,
  SLACK_DEPENDENCIES,
  SendSlackMessage,
} from '../../configx'
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
  [typeof SLACK_DEPENDENCIES.SLACK_SEND_MESSAGE, 'IEventStore']
>({
  label: 'Send Slack Message',
  typeName: 'slack/sendMessage',
  dependencyKeys: [SLACK_DEPENDENCIES.SLACK_SEND_MESSAGE, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: {
      [SLACK_DEPENDENCIES.SLACK_SEND_MESSAGE]: SendSlackMessage
      IEventStore: IEventStore
    },
    inputs: { content: string },
    write: (key: keyof Outputs, value: any) => void,
    commit: (key: string) => void
  ) => {
    const event = dependencies.IEventStore.currentEvent() as SlackEventPayload

    try {
      if (!event) {
        throw new Error('No event found')
      }

      const sendSlackMessage = dependencies[
        SLACK_DEPENDENCIES.SLACK_SEND_MESSAGE
      ] as SendSlackMessage

      if (!sendSlackMessage) {
        throw new Error('No sendDiscordMessage found')
      }

      await sendSlackMessage(inputs.content, event.channel)
    } catch (e) {
      console.log('Error sending slack message', e)
    }

    await commit('flow')
  },
})
