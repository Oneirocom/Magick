import { createAction, createAsyncNode, testAsyncNode } from 'plugins/factory'
import { EventPayload } from 'packages/server/plugin/src'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import LCMCLient from '../../services/lcmClient'
import { SLACK_ACTIONS } from '../../constants'

type Inputs = {
  flow: SocketDefinition
  prompt: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
  images: SocketDefinition
}

const process = async (
  dependencies: { lcmClient: LCMCLient; IEventStore: IEventStore },
  inputs: { prompt: string },
  write: (key: keyof Outputs, value: any) => void,
  commit: (key: string) => void,
  finished: () => void
) => {
  const event = dependencies.IEventStore.currentEvent() as EventPayload<any>

  try {
    const res = await dependencies.lcmClient.generateImage({
      prompt: inputs.prompt,
      agent_id: event.agentId,
    })

    write('images', res.data.output)

    commit('flow')
    finished()

    console.log('committed flow')
  } catch (error) {
    console.log(error)
    throw new Error('Failed to generate image')
  }
}

export const generateImage = testAsyncNode<
  Inputs,
  Outputs,
  ['lcmClient', 'IEventStore']
>({
  eventName: SLACK_ACTIONS.generateImage,
  label: 'Generate Image',
  typeName: 'slack/generateImage',
  dependencyKeys: ['lcmClient', 'IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    prompt: { valueType: 'string', defaultValue: 'A painting of a dog' },
  },
  outputs: {
    flow: { valueType: 'flow' },
    images: { valueType: 'string[]' },
  },
  process,
})
