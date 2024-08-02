import { createActionNode } from '@magickml/shared-plugins'
import { EventPayload } from '@magickml/shared-services'
import { type SlackEventPayload, SLACK_DEPENDENCIES } from '../../configx'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from '@magickml/agent-service'
import type { App } from '@slack/bolt'

type Inputs = {
  flow: SocketDefinition
  audioFile: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

export const sendSlackAudio = createActionNode<
  Inputs,
  Outputs,
  [typeof SLACK_DEPENDENCIES.SLACK_CLIENT, 'IEventStore']
>({
  label: 'Send Slack Audio',
  typeName: 'slack/sendAudio',
  dependencyKeys: [SLACK_DEPENDENCIES.SLACK_CLIENT, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    audioFile: { valueType: 'buffer' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: {
      [SLACK_DEPENDENCIES.SLACK_CLIENT]: App
      IEventStore: IEventStore
    },
    inputs: { audioFile: Buffer },
    write: (key: keyof Outputs, value: any) => void,
    commit: (key: string) => void
  ) => {
    const event =
      dependencies.IEventStore.currentEvent() as EventPayload<SlackEventPayload>

    // const audioStream = new Readable({
    //   read() {
    //     this.push(inputs.audioFile)
    //     this.push(null)
    //   },
    // })

    await dependencies[SLACK_DEPENDENCIES.SLACK_CLIENT].client.files.uploadV2({
      channels: event.channel,
      file: inputs.audioFile,
      filename: 'audio.mp3',
    })

    commit('flow')
  },
})
