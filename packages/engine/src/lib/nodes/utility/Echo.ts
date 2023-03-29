import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types'

const info = 'Returns the same output as the input'

type WorkerReturn = {
  output: string
}

export class Echo extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Echo', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Utility', info)

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
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const input = inputs.string[0] as string

    return {
      output: input,
    }
  }
}
