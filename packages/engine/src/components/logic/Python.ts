import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { CodeControl } from '../../dataControls/CodeControl'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { processCode } from '../../functions/processCode'

const defaultCode = `
# inputs: dictionary of inputs based on socket names outside the worker function
# data: internal data of the node to read or write to nodes data state
# state: access to the current game state in the state manager window. Return state to update the state.

inputs = {}
def worker(inputs, data, state):
  # Keys of the object returned must match the names
  # of your outputs you defined.
  # To update the state, you must return the modified state.
  outputs = dict(output1=input1, output2=input2)
  return outputs, data, state
worker(inputs, data, state)
`

const info = `The code component is your swiss army knife when other components won't cut it.  You can define any number of inputs and outputs on it, and then write a custom worker function.  You have access to the data plugged into the inputs you created on your component, and can send data out along your outputs.
Please note that the return of your function must be an object whose keys are the same value as the names given to your output sockets.  The incoming inputs argument is an object whose keys are the names you defined, and each is an array.
`


export class Python extends MagickComponent<unknown> {
  
  constructor() {
    // Name of the component
    super('Python')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }
    this.category = 'Logic'
    this.info = info
    this.display = false
    this.runFromCache = true
  }

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
      language: 'python'
    })


    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(outputGenerator)
      .add(codeControl)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node.addOutput(dataOutput).addInput(dataInput)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { magick: EngineContext; data: { code: unknown } }
  ) {
    const { magick, data } = context

    try {
      // const value = runCodeWithArguments(node.data.code)
      const value = processCode(node.data.code, inputs, data, 'python')

      return value
    } catch (err) {
      // close the data socket so it doesnt error out
      this._task.closed = ['data']
      throw err
    }
  }
}
