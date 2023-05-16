// DOCUMENTED
import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { numberSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// Information about the InRange component
const info = `Evaluate whether an input number is less than the value. Triggers true if it is, false if it isn't.`

/**
 * InRange Class represents a component that checks if a given number is within a specified range.
 */
export class LessThan extends MagickComponent<void> {
  constructor() {
    super(
      'Less Than',
      {
        outputs: { true: 'option', false: 'option' },
      },
      'Number',
      info
    )
  }

  /**
   * Build the node for the InRange component
   * @param node - The MagickNode instance
   */
  builder(node: MagickNode): void {
    const valueSocket = new Rete.Input('value', 'Value', numberSocket, false)

    const inspectorValueSocket = new InputControl({
      dataKey: 'value',
      name: 'Value',
      defaultValue: 0,
    })

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const testInput = new Rete.Input('input', 'Input To Test', numberSocket)

    const isTrue = new Rete.Output('true', 'True', triggerSocket)

    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    node
      .addInput(testInput)
      .addInput(valueSocket)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)

    node.inspector.add(inspectorValueSocket)
  }

  /**
   * Worker function to execute the InRange functionality
   * @param node - The WorkerData instance
   * @param inputs - The MagickWorkerInputs instance
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs): void {
    const value = (inputs['value'][0] as number) ?? (node.data.value as number)
    const numberToTest = inputs['input'][0] as number

    if (numberToTest < value) {
      this._task.closed = ['false']
    } else {
      this._task.closed = ['true']
    }
  }
}
