import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { InputControl } from '../../dataControls/InputControl'
import { WysiwygControl } from '../../dataControls/WysiwygControl'
import { triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const defaultCode = `
// inputs: dictionary of inputs based on socket names
// data: internal data of the node to read or write to nodes data state
// state: access to the current game state in the state manager window. Return state to update the state.
function worker(inputs, data, state) {
  // Keys of the object returned must match the names 
  // of your outputs you defined.
  // To update the state, you must return the modified state.
  return {}
}
`

const info = `The code component is your swiss army knife when other components won't cut it.  You can define any number of inputs and outputs on it, and then write a custom worker function.  You have access to the data plugged into the inputs you created on your component, and can send data out along your outputs.
Please note that the return of your function must be an object whose keys are the same value as the names given to your output sockets.  The incoming inputs argument is an object whose keys are the names you defined, and each is an array.
`
export class Wysiwyg extends ThothComponent<unknown> {
  constructor() {
    // Name of the component
    super('Wysiwyg')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }
    this.category = 'Logic'
    this.info = info
    this.display = true
  }

  builder(node: ThothNode) {
    if (!node.data.code) node.data.code = defaultCode

    const wysiwygControl = new WysiwygControl({
      dataKey: 'wysiwyg',
      name: 'Wysiwyg',
    })
    node.inspector.add(wysiwygControl)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node.addOutput(dataOutput).addInput(dataInput)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    {
      silent,
      data,
      thoth,
    }: { silent: boolean; thoth: EngineContext; data: { code: unknown } }
  ) {
    const { processCode, getCurrentGameState, updateCurrentGameState } = thoth
    if (!processCode) return

    const state = getCurrentGameState()

    try {
      // const value = runCodeWithArguments(node.data.code)
      const value = processCode(node.data.code, inputs, data, state)

      if (!silent) node.display(`${JSON.stringify(value)}`)
      if (value.state) updateCurrentGameState(value.state)

      return value
    } catch (err) {
      if (!silent) node.display(`Error evaluating code.`)

      // close the data socket so it doesnt error out
      this._task.closed = ['data']
      throw err
    }
  }
}
