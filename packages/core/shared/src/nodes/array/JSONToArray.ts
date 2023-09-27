// DOCUMENTED
/**
 * Class that represents a node that parses a JSON string into an array
 */
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/**
 * Information about the class
 */
const info =
  'Takes a JSON formatted string input and outputs an array created by parsing the string.'

/**
 * Array returned by the worker function
 */
type WorkerReturn = {
  output: string
}

export class JSONToArray extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for JSONToArray
   */
  constructor() {
    super(
      'JSON To Array',
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
   * Builds the node by adding its inputs and outputs
   * @param node - a MagickNode instance
   * @returns the completed node
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const input = new Rete.Input('input', 'String', stringSocket)
    const output = new Rete.Output('output', 'Array', arraySocket)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  /**
   * Parses the input JSON string into an Array
   * @param _node - a WorkerData instance
   * @param rawInputs - an array of MagickWorkerInputs
   * @returns the output object containing the parsed string
   */
  async worker(
    _node: WorkerData,
    rawInputs: MagickWorkerInputs
  ): Promise<WorkerReturn> {
    const str = rawInputs.input[0] as string

    // if str is already an object, return it
    // otherwise, if its a string, parse it
    if (typeof str === 'object') {
      return {
        output: str,
      }
    }

    return {
      output: JSON.parse(str),
    }
  }
}
