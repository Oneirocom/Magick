import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import {
  BANANA_API_KEY,
  BANANA_MODEL_KEY,
} from '../../config'
import { audioSocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Speech to Text node, powered by Whisper on Banana ML'

type InputReturn = {
  output: unknown
}

let banana = null;

export class SpeechToText extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Speech To Text')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'AI/ML'
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
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean; magick: EngineContext }
  ) {
    const audio = inputs['audio'] && inputs['audio'][0]

    const modelParameters = {
      mp3BytesString: audio,
    }

    if (!banana) {
      banana = await import('@banana-dev/banana-dev')
    }
    
    const output = await banana.run(BANANA_API_KEY, BANANA_MODEL_KEY, modelParameters)

    if (!silent) {
      if (!output) node.display('Error: No output returned', output)
      else node.display('Response is', output)
    }

    return { output }
  }
}
