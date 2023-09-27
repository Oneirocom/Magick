// DOCUMENTED
/**
 * A component that checks whether the input is null, undefined or empty.
 * @class
 * @extends {MagickComponent}
 */
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const INFO =
  'Checks if the input is null or undefined and triggers the appropriate output.'

export class IsNullOrUndefined extends MagickComponent<Promise<void>> {
  /**
   * Creates an instance of IsNullOrUndefined.
   */
  constructor() {
    super(
      'Is Null Or Undefined',
      {
        outputs: { true: 'option', false: 'option' },
      },
      'Flow',
      INFO
    )
  }

  /**
   * Builds the node using the input and output sockets.
   * @param {MagickNode} node - The node being built.
   * @returns The node with its input and output sockets added.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('input', 'Input', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  /**
   * Checks if the input is null, undefined or empty.
   * @param {WorkerData} _node - The node.
   * @param {MagickWorkerInputs} inputs - Inputs to check.
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const action = inputs['input'] && (inputs['input'][0] as string)
    const isNull =
      action === null || action === undefined || action.length <= 0
        ? true
        : false

    if (node?._task) node._task.closed = isNull ? ['false'] : ['true']
  }
}
