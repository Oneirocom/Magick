import { createAction, createAsyncNode, testAsyncNode } from 'plugins/shared/src'
import { EventPayload } from 'packages/server/plugin/src'
import { SocketDefinition } from '@magickml/behave-graph'
import { IEventStore } from 'server/grimoire'
import axios, { Axios, AxiosRequestConfig } from 'axios'

type Inputs = {
  flow: SocketDefinition
  text: SocketDefinition
  modelId: SocketDefinition
  voiceId: SocketDefinition
}

type Outputs = {
  flow: SocketDefinition
  audio: SocketDefinition
}

const process = async (
  dependencies: {
    IEventStore: IEventStore
  },
  inputs: { text: string; modelId: string; voiceId: string },
  write: (key: keyof Outputs, value: any) => void,
  commit: (key: string) => void,
  finished: () => void
) => {
  const options: AxiosRequestConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': '1a0955b9eabb1105d8ce2f4b69a5b63f',
      Accept: 'audio/mpeg',
    },
    data: JSON.stringify({
      model_id: inputs.modelId,
      text: inputs.text,
    }),
    url: `https://api.elevenlabs.io/v1/text-to-speech/${inputs.voiceId}`,
    responseType: 'arraybuffer',
  }

  try {
    const response = await axios(options)

    // Create a buffer from the response data
    const audioBuffer = Buffer.from(response.data, 'binary')
    write('audio', audioBuffer)

    commit('flow')
    finished()

    console.log('committed flow')
  } catch (error) {
    console.log(error)
    throw new Error('Failed to generate speech')
  }
}

export const generateSpeech = testAsyncNode<Inputs, Outputs, ['IEventStore']>({
  eventName: '123',
  label: 'Generate Speech',
  typeName: 'elevenlabs/generateSpeech',
  dependencyKeys: ['IEventStore'],
  inputs: {
    flow: { valueType: 'flow' },
    text: { valueType: 'string', defaultValue: 'hello world' },
    modelId: { valueType: 'string', defaultValue: 'eleven_multilingual_v2' },
    voiceId: { valueType: 'string', defaultValue: '09mMp1DS2qzVMMRC8S2P' },
  },
  outputs: {
    flow: { valueType: 'flow' },
    audio: { valueType: 'buffer' },
  },
  process,
})
