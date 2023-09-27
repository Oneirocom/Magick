// DOCUMENTED
/*
 * Rete Regular Expression Component
 * This component replaces a string with another in the input.
 */

import Rete from 'shared/rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/**
 * Information about the Regular Expression component.
 */
const info =
  'Takes an input string, searches it for the value specified in the Match property and replaces it with the value specified in the Replace property, then outputs the new string. The Match and Replace values can alternatively be passed in via the corresponding string inputs.'

/**
 * Type for worker return data.
 */
type WorkerReturn = {
  output: string
}

/**
 * Regular Expression class.
 * This class represents the Regular Expression component in the Node Editor.
 * Includes builder and worker functions.
 */
export class RegularExpression extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Regular Expression constructor.
   * Initializes the component with its name and sockets.
   */
  constructor() {
    super(
      'Regular Expression',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Text',
      info
    )
  }

  /**
   * Builder function for the component.
   * Sets up the UI and the inputs/outputs.
   * @param node {MagickNode} The node being built.
   */
  builder(node: MagickNode) {
    // Add input controls
    const rule = new InputControl({
      dataKey: 'rule',
      name: 'Name',
      icon: 'moon',
    })

    node.inspector.add(rule)

    // Add sockets
    const strInput = new Rete.Input('input', 'Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    // Add input and output sockets to the node
    return node
      .addInput(dataInput)
      .addInput(strInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * Worker function for the component.
   * Performs the string replacement operation.
   * @param node {WorkerData} The node data.
   * @param rawInputs {MagickWorkerInputs} The raw inputs to the component.
   */
  async worker(node: WorkerData, rawInputs: MagickWorkerInputs) {
    const input = rawInputs['input'] && (rawInputs['input'][0] as string)
    const match = node.data.rule as any

    let replacedInput = input

    // Check if the input and match are defined
    if (input && match) {
      // Create a regex object
      const regex = new RegExp(match, 'g')

      // Use the replace function to replace all matching substrings
      replacedInput = input.replace(regex, '')
    } else {
      throw new Error('Input and match must be defined')
    }

    return {
      output: replacedInput,
    }
  }
}
