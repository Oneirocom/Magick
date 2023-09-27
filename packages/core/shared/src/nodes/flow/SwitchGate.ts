// DOCUMENTED
import Rete from 'shared/rete'

import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import {
  DataSocketType,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * Info message for the SwitchGate component.
 */
const info = `The Switch Gate component takes a single input, and allows you to define any number of outputs. It works the same as the javascript switch. The component will try to match the value of the input to one of the output socket names you have created. It will route the trigger signal through that socket, or the default trigger socket if no cases match.`

/**
 * The SwitchGate class extends the MagickComponent and manages a single input and multiple output logic.
 */
export class SwitchGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super(
      'Switch',
      {
        outputs: { default: 'option' },
      },
      'Flow',
      info
    )

    this.common = true
  }

  node = {}

  /**
   * Builds the node with inputs and outputs and an output generator control.
   * @param node - The MagickNode to build.
   * @returns - The built MagickNode.
   */
  builder(node: MagickNode) {
    const outputGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      ignored: ['default'],
      socketType: 'triggerSocket',
      taskType: 'option',
      name: 'Output Sockets',
      tooltip: 'Add output sockets',
    })

    const input = new Rete.Input('input', 'Input', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const defaultOutput = new Rete.Output('default', 'Default', triggerSocket)

    // Add inputs and output to the node
    node.addInput(input).addInput(dataInput).addOutput(defaultOutput)

    // Add output generator to the inspector
    node.inspector.add(outputGenerator)

    return node
  }

  /**
   * Worker function that defines the business logic of the node.
   * @param node - The WorkerData.
   * @param inputs - The MagickWorkerInputs.
   * @param _outputs - The MagickWorkerOutputs.
   */
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {
    const input = inputs['input'][0] as string
    const nodeOutputs = node.data.outputs as DataSocketType[]

    // Close all outputs
    if (node?._task) {
      node._task.closed = ['default', ...nodeOutputs.map(out => out.name)]

      if (node._task.closed.includes(input)) {
        // If the outputs closed have the incoming text, filter closed outputs to not include it
        node._task.closed = node._task.closed.filter(output => output !== input)
      } else {
        // Otherwise, open up the default output
        node._task.closed = node._task.closed.filter(
          output => output !== 'default'
        )
      }
    }
  }
}
