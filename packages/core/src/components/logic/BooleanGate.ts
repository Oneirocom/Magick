import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types'
import { booleanSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info = `The boolean gate takes a boolean input, and depending on whether the value is true or false will only trigger one output or the other.`

export class BooleanGate extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('Boolean Gate')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }
    this.category = 'Logic'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    const bool = new Rete.Input('boolean', 'Boolean', booleanSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(bool)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const isTrue = inputs['boolean'][0]

    if (isTrue) {
      this._task.closed = ['false']
    } else {
      this._task.closed = ['true']
    }
  }
}
