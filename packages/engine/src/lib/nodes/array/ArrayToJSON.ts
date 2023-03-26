import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { arraySocket, objectSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types'

const info =
  'Convert an object into a JSON string.'

type WorkerReturn = {
  output: string
}

export class ArrayToJSON extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Array To JSON', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Array', info)
    this.display = true
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'String', stringSocket)
    const input = new Rete.Input('input', 'Array', arraySocket)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    console.log('input', rawInputs.input)
    const obj = rawInputs.input[0] as string

    return {
      output: JSON.stringify(obj),
    }
  }
}
