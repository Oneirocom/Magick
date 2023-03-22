import Rete from 'rete'

import {
  EngineContext,
  MagickNodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { audioSocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Speech to Text node, powered by Whisper on Banana ML'

type InputReturn = {
  output: unknown
}

let banana: any = null

export class SpeechToText extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Speech To Text')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'Generation'
    this.display = true
    this.info = info
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
