import.meta.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Returns the input string as voice'

type WorkerReturn = {
  output: string
}

const API_URL = 'https://0.0.0.0:8001'

export class TextToSpeech extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Text to Speech')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'module',
      socket: anySocket,
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
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
      .addInput(textInput)
      .addInput(triggerInput)
      .addInput(voiceProviderInp)
      .addInput(characterInp)
      .addInput(languageCodeInp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    console.log('INPUTS:', inputs)
    const action = inputs['input'][0]
    const voiceProvider = inputs['voiceProvider'][0]
    const character = inputs['character']?.[0] as string
    const languageCode = inputs['languageCode']?.[0] as string
    const tiktalknet_url = node.data?.tiktalknet_url as string

    const isCommand = (action as string).startsWith('/')

    let url: any = undefined

    if (!isCommand && action) {
      url = await axios.get(`${API_URL}/text_to_speech`, {
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
      output: isCommand ? (action as string) : (url.data as string),
    }
  }
}
