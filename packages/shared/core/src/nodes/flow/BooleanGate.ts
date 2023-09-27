// DOCUMENTED
/**
 * This component represents a boolean gate. It takes a boolean input, and depending on whether the value is true or false will only trigger one output or the other.
 */
import Rete from 'shared/rete'
import { MagickComponent } from '../../engine'
import { booleanSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = `The boolean gate takes a boolean input, and depending on whether the value is true or false will only trigger one output or the other.`

export class BooleanGate extends MagickComponent<void> {
  constructor() {
    super(
      'Boolean Gate',
      {
        outputs: { true: 'option', false: 'option' },
      },
      'Flow',
      info
    )
  }

  /**
   * The builder function is used to "assemble" the node component.
   * @param node - the node component to build.
   * @returns the node object with the inputs and outputs added to it.
   */
  builder(node: MagickNode) {
    const bool = new Rete.Input('boolean', 'Boolean', booleanSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(bool)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  /**
   * The worker function contains the main business logic of the node.
   * It will pass those results to the outputs to be consumed by any connected components.
   * @param _node - the worker node to execute.
   * @param inputs - the inputs for the worker node.
   */
  worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const isTrue = inputs['boolean'][0]

    if (isTrue) {
      if (node?._task) node._task.closed = ['false']
    } else {
      if (node?._task) node._task.closed = ['true']
    }
  }
}
