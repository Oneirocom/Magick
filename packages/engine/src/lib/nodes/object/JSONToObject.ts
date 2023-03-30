// GENERATED 
/**
 * Class that represents a node that parses a JSON string into an Object 
 */
import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { objectSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types'

/**
 * Information about the class
 */
const info =
  'InputsToJSON runs JSON.stringify on the inputs and returns the result'

/**
 * Object returned by the worker function
 */
type WorkerReturn = {
  output: string
}

export class ParseJSON extends MagickComponent<Promise<WorkerReturn>> {

  /**
   * Constructor for ParseJSON
   */
  constructor() {
    super('JSON To Object', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Object', info)
  }

  /**
   * Builds the node by adding its inputs and outputs
   * @param node - a MagickNode instance
   * @returns the completed node
   */
  builder(node: MagickNode): MagickNode {
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

  /**
   * Parses the input JSON string into an Object
   * @param _node - a WorkerData instance
   * @param rawInputs - an array of MagickWorkerInputs
   * @returns the output object containing the parsed string
   */
  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs): Promise<WorkerReturn> {
    const str = rawInputs.input[0] as string

    return {
      output: JSON.parse(str),
    }
  }
}