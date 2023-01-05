import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types'
import { triggerSocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info = `The or gate will be triggered when either of two triggers are triggered off.`

export class OrGate extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('Or Gate')

    this.task = {
      outputs: { trigger: 'option' },
    }
    this.category = 'Logic'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
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
