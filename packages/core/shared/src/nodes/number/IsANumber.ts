// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// Information about the InRange component
const info = `Evaluate whether an input is a number. Triggers true if it is, false if it isn't.`

/**
 * InRange Class represents a component that checks if a given number is within a specified range.
 */
export class IsANumber extends MagickComponent<void> {
  constructor() {
    super(
      'Is A Number',
      {
        outputs: { true: 'option', false: 'option' },
      },
      'Flow',
      info
    )
  }

  /**
   * Build the node for the InRange component
   * @param node - The MagickNode instance
   */
  builder(node: MagickNode): void {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const testInput = new Rete.Input('input', 'Input To Test', anySocket)

    const isTrue = new Rete.Output('true', 'True', triggerSocket)

    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    node
      .addInput(testInput)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  /**
   * Worker function to execute the InRange functionality
   * @param node - The WorkerData instance
   * @param inputs - The MagickWorkerInputs instance
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs): void {
    const numberToTest = inputs['input'][0] as any

    const isAnObject = typeof numberToTest === 'object'

    const isANumber = !isAnObject && !isNaN(Number.parseFloat(numberToTest))

    if (isANumber) {
      if (node?._task) node._task.closed = ['false']
    } else {
      if (node?._task) node._task.closed = ['true']
    }
  }
}
