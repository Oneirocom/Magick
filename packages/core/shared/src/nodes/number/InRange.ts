// DOCUMENTED
import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { numberSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// Information about the InRange component
const info = `Takes a number input and checks whether it is in the range of the start and end numbers (inclusive) and triggers the appropriate output. The start and end numbers come from the Start Number and End Number properties by default, but they can optionally come from the Start Number and End Number input sockets.`

/**
 * InRange Class represents a component that checks if a given number is within a specified range.
 */
export class InRange extends MagickComponent<void> {
  constructor() {
    super(
      'In Range',
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
    const startNumSocket = new Rete.Input(
      'startNumber',
      'Start Number',
      numberSocket,
      false
    )

    const endNumSocket = new Rete.Input(
      'endNumber',
      'End Number',
      numberSocket,
      false
    )

    const inspectorStartNumSocket = new InputControl({
      dataKey: 'startNumber',
      name: 'Start Number',
      defaultValue: 10,
    })

    const inspectorEndNumSocket = new InputControl({
      dataKey: 'endNumber',
      name: 'End Number',
      defaultValue: 100,
    })

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const testInput = new Rete.Input('input', 'Input To Test', numberSocket)

    const isTrue = new Rete.Output('true', 'True', triggerSocket)

    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    node
      .addInput(testInput)
      .addInput(startNumSocket)
      .addInput(endNumSocket)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)

    node.inspector.add(inspectorStartNumSocket).add(inspectorEndNumSocket)
  }

  /**
   * Worker function to execute the InRange functionality
   * @param node - The WorkerData instance
   * @param inputs - The MagickWorkerInputs instance
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs): void {
    const startRange =
      (inputs['startNumber'][0] as number) ?? (node.data.startNumber as number)
    const endRange =
      (inputs['endNumber'][0] as number) ?? (node.data.endNumber as number)
    const numberToTest = inputs['input'][0] as number

    if (numberToTest >= startRange && numberToTest <= endRange) {
      this._task.closed = ['false']
    } else {
      this._task.closed = ['true']
    }
  }
}
