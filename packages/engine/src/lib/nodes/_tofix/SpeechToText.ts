import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { audioSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types'

const info = 'Speech to Text node, powered by Whisper on Banana ML'

type InputReturn = {
  output: unknown
}

let banana: any = null

export class SpeechToText extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Speech To Text', {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }, 'Generation', info)
    this.display = true
  }

  builder(node: MagickNode) {
    const audioInput = new Rete.Input('audio', 'Audio', audioSocket, true)

    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addInput(triggerInput)
      .addInput(audioInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const audio = inputs['audio'] && inputs['audio'][0]

    const modelParameters = {
      mp3BytesString: audio,
    }

    if (!banana) {
      banana = await import('@banana-dev/banana-dev')
    }

    const BANANA_API_KEY = ''
    const BANANA_MODEL_KEY = ''

    const output = await banana.run(
      BANANA_API_KEY,
      BANANA_MODEL_KEY,
      modelParameters
    )

    return { output }
  }
}
