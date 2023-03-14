import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Returns the same output as the input'

type WorkerReturn = {
  output: string
}

export class Echo extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Echo')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Utility'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  // eslint-disable-next-line @typescript-eslint/require-await, require-await
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const input = inputs.string[0] as string

    return {
      output: input,
    }
  }
}
