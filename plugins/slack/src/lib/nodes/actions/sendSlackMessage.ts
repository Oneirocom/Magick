import { EventPayload } from 'server/plugin'
import { type SlackEventPayload, SLACK_DEP_KEYS } from '../../config'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import { createActionNode } from 'plugins/shared/src'
import { type App } from '@slack/bolt'

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
  [typeof SLACK_DEP_KEYS.SLACK_KEY, 'IEventStore']
>({
  label: 'Send Slack Message',
  typeName: 'slack/sendMessage',
  dependencyKeys: [SLACK_DEP_KEYS.SLACK_KEY, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    content: { valueType: 'string' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: { [SLACK_DEP_KEYS.SLACK_KEY]: App; IEventStore: IEventStore },
    inputs: { content: string },
    write: (key: keyof Outputs, value: any) => void,
    commit: (key: string) => void
  ) => {
    const event =
      dependencies.IEventStore.currentEvent() as EventPayload<SlackEventPayload>

    await dependencies[SLACK_DEP_KEYS.SLACK_KEY].client.chat.postMessage({
      text: inputs.content,
      channel: event.channel,
    })

    commit('flow')
  },
})
