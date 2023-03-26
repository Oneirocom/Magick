import Rete from 'rete'
import { InputControl } from '../../dataControls/InputControl'

import { MagickComponent } from '../../engine'
import { arraySocket, triggerSocket } from '../../sockets'
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

export class RemapArray extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Remap Array', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Array', info)

    this.display = true
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('input', 'Input', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Output', arraySocket)

    const values = new InputControl({
      dataKey: 'values',
      name: 'Values (, separated)'
    })


    node.inspector.add(values)

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
    // eslint-disable-next-line @typescript-eslint/ban-types
    const input = inputs.input[0] as Object[]

    // get values
    const values = (node.data.values as string).split(',').map((v) => v.trim())


    console.log('***************** input')
    console.log(input)
    return {
      output: input.map((obj => {
        const newObject = {}
        for (const key in obj) {
          if (values.includes(key)) {
            newObject[key] = obj[key]
          }
        }
        return newObject;
      })),
    }
  }
}
