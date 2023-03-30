/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios, { AxiosResponse } from 'axios'
import Rete from 'rete'

import {
  API_ROOT_URL
} from '../../config'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { anySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  WorkerData
} from '../../types'

const info = 'Returns the input string as voice'

type WorkerReturn = {
  output: string | undefined
}

export class TextToSpeech extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Text to Speech', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Generation', info)

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    }

  }

  builder(node: MagickNode) {
    const textInput = new Rete.Input('input', 'Input', anySocket, true)
    const voiceProviderInp = new Rete.Input(
      'voiceProvider',
      'Voice Provider',
      stringSocket,
      true
    )
    const characterInp = new Rete.Input('character', 'Character', stringSocket)
    const languageCodeInp = new Rete.Input(
      'languageCode',
      'Language Code',
      stringSocket
    )
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    const tiktalknet_url = new InputControl({
      dataKey: 'tiktalknet_url',
      name: 'Tiktalknet URL',
    })

    node.inspector.add(tiktalknet_url)

    return node
      .addInput(triggerInput)
      .addInput(textInput)
      .addInput(voiceProviderInp)
      .addInput(characterInp)
      .addInput(languageCodeInp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    console.log('INPUTS:', inputs)
    const action = inputs['input'][0]
    const voiceProvider = inputs['voiceProvider'][0]
    const character = inputs['character']?.[0] as string
    const languageCode = inputs['languageCode']?.[0] as string
    const tiktalknet_url = node.data?.tiktalknet_url as string

    const isCommand = (action as string).startsWith('/')

    let url: AxiosResponse<string>|undefined = undefined

    if (!isCommand && action) {
      url = await axios.get<string>(`${API_ROOT_URL}/text_to_speech`, {
        params: {
          text: action,
          voice_provider: voiceProvider,
          voice_character: character,
          voice_language_code: languageCode,
          tiktalknet_url: tiktalknet_url,
        },
      })
    }
 
    return {
      output: isCommand ? (action as string) : (url?.data),
    }
  }
}
