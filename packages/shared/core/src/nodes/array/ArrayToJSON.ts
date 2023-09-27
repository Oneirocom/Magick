// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// Component information that will display in the editor
const info = 'Takes an input array and outputs a JSON array string.'

type WorkerReturn = {
  output: string
}

/**
 * A Rete component that will take an object input and return a string representation of it as JSON.
 */
export class ArrayToJSON extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Initialize a new instance of the ArrayToJSON component.
   */
  constructor() {
    super(
      'Array To JSON',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Arrays',
      info
    )
  }

  /**
   * Define the input and output sockets for the component.
   * @param node The node to build/connect sockets to
   * @returns The built node with input and output sockets.
   */
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

  /**
   * Process the received inputs and return the converted JSON string.
   * @param _node The current worker's node data.
   * @param rawInputs The input data received by the worker.
   * @returns A Promise that resolves to an object containing the converted JSON string.
   */
  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    console.log('input', rawInputs.input)
    const obj = rawInputs.input[0] as string

    return {
      output: JSON.stringify(obj),
    }
  }
}
