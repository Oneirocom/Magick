import Rete from 'rete'

import {
  DataSocketType,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { anySocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `The Switch Gate component takes a single input, and allows you to define any number of outputs.  It works the same as the javascript switch.  The component will try to match the value of the input to one of the output socket names you have created.  It will route the trigger signal through that socket.`

export class SwitchGate extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('Switch')

    this.task = {
      outputs: { default: 'option' },
    }
    this.display = true
    this.category = 'Logic'
    this.info = info
  }

  node = {}

  builder(node: ThothNode) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      ignored: ['default'],
      socketType: 'triggerSocket',
      taskType: 'option',
      name: 'Output Sockets',
    })

    node.inspector.add(outputGenerator)

    const input = new Rete.Input('input', 'Input', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const defaultOutput = new Rete.Output('default', 'Default', triggerSocket)

    node.addInput(input).addInput(dataInput).addOutput(defaultOutput)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const input = inputs['input'][0] as string
    const nodeOutputs = node.data.outputs as DataSocketType[]

    // close all outputs
    this._task.closed = ['default', ...nodeOutputs.map(out => out.name)]

    if (!silent) {
      node.display(input as string)
    }

    if (this._task.closed.includes(input)) {
      // If the ouputs closed has the incoming text, filter closed outputs to not include it
      this._task.closed = this._task.closed.filter(output => output !== input)
    } else {
      // otherwise open up the default output
      this._task.closed = this._task.closed.filter(
        output => output !== 'default'
      )
    }
  }
}
