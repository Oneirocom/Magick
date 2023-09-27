// DOCUMENTED
/**
 * Represents a Rete object-to-JSON conversion component.
 */
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { objectSocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// A description of the component's functionality
const info = 'Takes an Object input and converts into a JSON string output.'

// The return type of the worker function
type WorkerReturn = {
  output: string
}

/**
 * A Rete component that converts an object to a JSON string.
 */
export class ObjectToJSON extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Call the superclass constructor with the component's name, output, and info.
    super(
      'Object To JSON',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Object',
      info
    )
  }

  /**
   * Build the component by adding its inputs and outputs to the provided node.
   *
   * @param node - The Rete node representing the component.
   * @returns The provided node after adding inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'String', stringSocket)
    const input = new Rete.Input('input', 'Object', objectSocket)

    node.addInput(dataInput)
    node.addInput(input)
    node.addOutput(dataOutput)
    node.addOutput(output)

    return node
  }

  /**
   * Convert the provided input object into a JSON string.
   *
   * @param _node - The Rete node representing the component.
   * @param rawInputs - An object containing the inputs to the component.
   * @returns An object containing the resulting JSON string converted from the input object.
   */
  async worker(
    _node: WorkerData,
    rawInputs: MagickWorkerInputs
  ): Promise<WorkerReturn> {
    const obj = rawInputs.input && (rawInputs.input[0] as string)

    return {
      output: JSON.stringify(obj),
    }
  }
}
