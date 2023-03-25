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
  WorkerData
} from '../../types'

const defaultCode =`
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

const info = `The code component is your swiss army knife when other components won't cut it.  You can define any number of inputs and outputs on it, and then write a custom worker function.  You have access to the data plugged into the inputs you created on your component, and can send data out along your outputs.
Please note that the return of your function must be an object whose keys are the same value as the names given to your output sockets.  The incoming inputs argument is an object whose keys are the names you defined, and each is an array.
`
export class Javascript extends MagickComponent<unknown> {
  constructor() {
    // Name of the component
    super('Javascript', {
      outputs: {
        trigger: 'option',
      },
    }, 'Code', info)
    this.display = false
    this.runFromCache = true
  }

  builder(node: MagickNode) {
        const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

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
      language: 'javascript',
    })

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    node
      .addOutput(dataOutput)
      .addInput(dataInput)

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(outputGenerator)
      .add(codeControl)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { data: { code: unknown } }
  ) {
    const { data } = context

    try {
      // const value = runCodeWithArguments(node.data.code)
      const value = await processCode(node.data.code, inputs, data, 'javascript')
      console.log('value', value)

      return value
    } catch (err) {
      // close the data socket so it doesnt error out
      this._task.closed = ['data']
      return console.error(err)
    }
  }
}
