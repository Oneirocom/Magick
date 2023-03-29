import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { objectSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types'

const info =
  'InputsToJSON runs JSON.stringify on the inputs and returns the result'

type WorkerReturn = {
  output: string
}

export class ParseJSON extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('JSON To Object', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Object', info)

  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const input = new Rete.Input('input', 'String', stringSocket)
    const output = new Rete.Output('output', 'Object', objectSocket)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    const str = rawInputs.input[0] as string

    return {
      output: JSON.parse(str),
    }
  }
}
