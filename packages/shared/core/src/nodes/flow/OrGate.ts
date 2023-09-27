// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { triggerSocket } from '../../sockets'
import { MagickNode } from '../../types'

const info = 'Triggers the output when either of the inputs is triggered.'
/**
 * @description
 * The or gate will be triggered when either of two triggers are triggered off.
 */
export class OrGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Or Gate', { outputs: { trigger: 'option' } }, 'Flow', info)
  }

  /**
   * @description
   * Builds the node by assembling its inputs and outputs.
   *
   * @param {MagickNode} node - The node to be built.
   * @returns {MagickNode} - The built node.
   */
  builder(node: MagickNode): MagickNode {
    const trigger1 = new Rete.Input('trigger1', 'Trigger 1', triggerSocket)
    const trigger2 = new Rete.Input('trigger2', 'Trigger 2', triggerSocket)
    const outTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node.addInput(trigger1).addInput(trigger2).addOutput(outTrigger)
  }

  /**
   * @description
   * Contains the main business logic of the node. Passes the results
   * to the outputs to be consumed by any connected components.
   *
   * @returns {null} - No functionality in this worker.
   */
  worker(): null {
    return null
  }
}
