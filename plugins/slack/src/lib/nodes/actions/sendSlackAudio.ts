import { createAction } from 'plugins/shared/src'
import { SlackClient } from '../../services/slack'
import { EventPayload } from 'packages/server/plugin/src'
import { SlackEventPayload } from '../../types'
import { SocketDefinition } from '@magickml/behave-graph'
import { SLACK_KEY } from '../../constants'
import { IEventStore } from 'server/grimoire'
import { Readable } from 'stream'

type Inputs = {
  flow: SocketDefinition
  audioFile: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
}

export const sendSlackAudio = createAction<
  Inputs,
  Outputs,
  [typeof SLACK_KEY, 'IEventStore']
>({
  label: 'Send Slack Audio',
  typeName: 'slack/sendAudio',
  dependencyKeys: [SLACK_KEY, 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    audioFile: { valueType: 'buffer' },
  },
  outputs: {
    flow: { valueType: 'flow' },
  },
  process: async (
    dependencies: { [SLACK_KEY]: SlackClient; IEventStore: IEventStore },
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

    await dependencies[SLACK_KEY].getClient().client.files.uploadV2({
      channels: event.channel,
      file: inputs.audioFile,
      filename: 'audio.mp3',
    })

    commit('flow')
  },
})
