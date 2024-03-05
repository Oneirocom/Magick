import { createActionNode } from 'plugins/shared/src'
import { EventPayload } from 'server/plugin'
import { type SlackEventPayload, SLACK_DEP_KEYS } from '../../config'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
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
  [typeof SLACK_DEP_KEYS.SLACK_KEY, 'IEventStore']
>({
  label: 'Send Slack Audio',
  typeName: 'slack/sendAudio',
  dependencyKeys: [SLACK_DEP_KEYS.SLACK_KEY, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    audioFile: { valueType: 'buffer' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: { [SLACK_DEP_KEYS.SLACK_KEY]: App; IEventStore: IEventStore },
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

    await dependencies[SLACK_DEP_KEYS.SLACK_KEY].client.files.uploadV2({
      channels: event.channel,
      file: inputs.audioFile,
      filename: 'audio.mp3',
    })

    commit('flow')
  },
})
