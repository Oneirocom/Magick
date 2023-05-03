// DOCUMENTED
import Rete from 'rete'

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

// Default code string for the Python component
const defaultCode = `
# inputs: dictionary of inputs based on socket names outside the worker function
# return: dictionary of outputs based on socket names outside the worker function, and data as the second argument
# data: internal data of the node to read or write to nodes data state
# Make sure to call function with inputs and data as arguments

inputs = {input1} # REPLACE WITH SOCKET NAMES
def worker(inputs, data):
  # Keys of the object returned must match the names
  # of your outputs you defined.
  outputs = dict(output1=input1) # REPLACE WITH OUTPUT SOCKET NAMES
  return outputs, data
worker(inputs, data)
`

// Information about the Python component
const info = `
The code component is your swiss army knife when other components won't cut it.  You can define any number of inputs and outputs on it, and then write a custom worker function.  You have access to the data plugged into the inputs you created on your component, and can send data out along your outputs.
Please note that the return of your function must be an object whose keys are the same value as the names given to your output sockets.  The incoming inputs argument is an object whose keys are the names you defined, and each is an array.
`

/**
 * A class that represents the Python component for Rete.
 */
export class Python extends MagickComponent<unknown> {
  constructor() {
    // Name of the component
    super(
      'Python',
      {
        outputs: {
          trigger: 'option',
        },
      },
      'Code',
      info
    )
    // this.runFromCache = true;
  }

  /**
   * Builder method for creating the Python component node in Rete.
   * @param node - The MagickNode instance to build.
   * @returns The built MagickNode instance.
   */
  builder(node: MagickNode) {
    if (!node.data.code) node.data.code = defaultCode

    const outputGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      ignored: ['trigger'],
      name: 'Output Sockets',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
    })

    const codeControl = new CodeControl({
      dataKey: 'code',
      name: 'Code',
      language: 'python',
    })

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(outputGenerator)
      .add(codeControl)

    node.addOutput(dataOutput).addInput(dataInput)

    return node
  }

  /**
   * Worker method for processing the data in the Python component.
   * @param node - The WorkerData instance containing data about the node.
   * @param inputs - The MagickWorkerInputs instance containing input data.
   * @param _outputs - The MagickWorkerOutputs instance containing output data.
   * @param context - The context object with a data property.
   * @returns The value from the processed code.
   */
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { data: { code: unknown } }
  ) {
    const { data } = context

    try {
      // const value = runCodeWithArguments(node.data.code);
      const value = processCode(node.data.code, inputs, data, 'python')

      return value
    } catch (err) {
      // close the data socket so it doesn't error out
      this._task.closed = ['data']
      return console.error(err)
    }
  }
}
