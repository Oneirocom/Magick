// UNDOCUMENTED
import Rete from 'rete'
import { MagickComponent } from '../../engine'
import { arraySocket, triggerSocket, stringSocket } from '../../sockets'
import {
  MagickNode,
  WorkerData,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'

/**
 * Returns a single string from an array of strings where each element is on a new line.
 */
type WorkerReturn = {
  output: string
}

/**
 * Gets a value from an array
 */
export class ArrayToString extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Array to String',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Array',
      'Takes an input array and outputs a string where each element in the array is on a new line.'
    )
  }

  /**
   * Builds the list of input and output sockets.
   * @param node - The Magick node to add the sockets to.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('array', 'Array', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * Concatenates all the input values from the array into a single string, with each element separated by a newline.
   * @param node - The node the component is attached to.
   * @param inputs - An object where the keys are the names of the input sockets and the values are arrays of that socket's values.
   * @param outputs - An object where the keys are the names of the output sockets and the values are arrays of that socket's values.
   * @returns A string where each element in the array is on a new line.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
    const input = inputs.array[0] as string[]

    const outputString = input.join('\n')

    return {
      output: outputString,
    }
  }
}
