// DOCUMENTED
import Rete from 'shared/rete'

import { CodeControl } from '../../dataControls/CodeControl'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { processCode } from '../../functions/processCode'
import { triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

// Default worker code for a new Javascript node
const defaultCode = `
// inputs: dictionary of inputs based on socket names
// data: internal data of the node to read or write to nodes data state
function worker({
}, data) {
  // Keys of the object returned must match the names
  // of your outputs you defined.
  // To update the state, you must return the modified state.
  return {}
}
`

// Information about the Javascript component
const info = `The code component is your swiss army knife when other components won't cut it.  You can define any number of inputs and outputs on it, and then write a custom worker function.  You have access to the data plugged into the inputs you created on your component, and can send data out along your outputs.

Please note that the return of your function must be an object whose keys are the same value as the names given to your output sockets. The incoming inputs argument is an object whose keys are the names you defined.
`

/**
 * Javascript component allows creating customizable worker with definable inputs and outputs.
 */
export class Javascript extends MagickComponent<unknown> {
  constructor() {
    // Name of the component
    super(
      'Javascript',
      {
        outputs: {
          trigger: 'option',
        },
      },
      'Invoke/Languages',
      info
    )
    // this.runFromCache = true
  }

  /**
   * Builds the entire node with its inputs and controls.
   *
   * @param node - The MagickNode to build.
   * @returns The built MagickNode.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    if (!node.data.code) node.data.code = defaultCode

    const outputGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      ignored: ['trigger'],
      name: 'Output Sockets',
      tooltip: 'Add output sockets',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
      tooltip: 'Add input sockets',
    })

    const codeControl = new CodeControl({
      dataKey: 'code',
      name: 'Code',
      language: 'javascript',
      tooltip: 'Open code editor',
    })

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
      tooltip: 'Enter component name',
    })

    node.addOutput(dataOutput).addInput(dataInput)

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(outputGenerator)
      .add(codeControl)

    return node
  }

  /**
   * The worker contains the main business logic of the node. It will pass those results
   * to the outputs to be consumed by any connected components.
   *
   * @param node - The WorkerData to process.
   * @param inputs - MagickWorkerInputs to use in the worker.
   * @param _outputs - MagickWorkerOutputs to send to connected components.
   * @param context - Contains the code to process.
   * @returns The result(s) of the execution.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { data: { code: unknown } }
  ) {
    const { data } = context

    try {
      // const value = runCodeWithArguments(node.data.code)
      const value = await processCode(
        node.data.code,
        inputs,
        data,
        'javascript'
      )

      return value
    } catch (err) {
      // close the data socket so it doesnt error out
      if (node?._task) node._task.closed = ['data']
      return console.error(err)
    }
  }
}
