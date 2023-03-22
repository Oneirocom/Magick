import Rete from 'rete'

import { MagickNode, MagickWorkerInputs } from '../../types'
import { triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `The or gate will be triggered when either of two triggers are triggered off.`

export class OrGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Or Gate')

    this.task = {
      outputs: { trigger: 'option' },
    }
    this.category = 'Flow'
    this.info = info
  }

  // the builder is used to "assemble" the node component.

  builder(node: MagickNode) {
    const trigger1 = new Rete.Input('trigger1', 'Trigger 1', triggerSocket)
    const trigger2 = new Rete.Input('trigger2', 'Trigger 2', triggerSocket)
    const outTrigger = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node.addInput(trigger1).addInput(trigger2).addOutput(outTrigger)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker() {
    return null
  }
}
