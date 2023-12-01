// DOCUMENTED
import Rete from 'shared/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, triggerSocket, anySocket } from '../../sockets'
import {
  MagickNode,
  WorkerData,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'

/**
 * Returns the same output as the input
 */
type WorkerReturn = {
  output: string
}

/**
 * Gets a value from an array
 */
export class GetValueFromArray extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Get Value From Array',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Arrays',
      'Takes an input array and outputs the value in that array whose key matches the key specified in the Element property.'
    )
  }

  /**
   * Builds the list of input and output sockets.
   * @param node - The Magick node to add the sockets to.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('array', 'Data/Arrays', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Value', anySocket)

    const element = new InputControl({
      dataKey: 'element',
      name: 'Element',
      defaultValue: 0,
      tooltip: 'this is a element input',
    })

    node.inspector.add(element)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * Gets the input value from the array at the index specified by the element property.
   * @param node - The node the component is attached to.
   * @param inputs - An object where the keys are the names of the input sockets and the values are arrays of that socket's values.
   * @param outputs - An object where the keys are the names of the output sockets and the values are arrays of that socket's values.
   * @returns The value of the array element at the index specified by the element property.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
    const input = inputs.array[0] as any
    const element = node.data.element as number

    const arrayElement = input[element]

    return {
      output: arrayElement,
    }
  }
}
