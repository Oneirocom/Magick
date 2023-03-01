import Rete from 'rete'

import { NodeData, MagickNode, MagickWorkerInputs } from '../../types'
import { booleanSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `The boolean gate takes a boolean input, and depending on whether the value is true or false will only trigger one output or the other.`

export class BooleanGate extends MagickComponent<void> {
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

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(_node: NodeData, inputs: MagickWorkerInputs) {
    const isTrue = inputs['boolean'][0]

    if (isTrue) {
      this._task.closed = ['false']
    } else {
      this._task.closed = ['true']
    }
  }
}
