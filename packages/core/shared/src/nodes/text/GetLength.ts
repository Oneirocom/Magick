// DOCUMENTED
/**
 * Get the length of the input string.
 * @category Text
 */
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { numberSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: number
}

/**
 * Get the length of the input string.
 * @category Text
 */
export class GetLength extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Get Length',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Text',
      'Get the length of the input string.'
    )
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Length', numberSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * The worker function for the Echo node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @returns An object containing the same string as the input.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
    const input = inputs.string[0] as string

    return {
      output: input.length,
    }
  }
}
