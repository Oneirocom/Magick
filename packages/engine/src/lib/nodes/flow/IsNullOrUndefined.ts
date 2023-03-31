import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types'

const info = 'Is Null Or Undefined checks if the input is null or undefined'

export class IsNullOrUndefined extends MagickComponent<Promise<void>> {
  constructor() {
    super('Is Null Or Undefined', {
      outputs: { true: 'option', false: 'option' },
    }, 'Flow', info)

  }

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

  async worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    const action = inputs['string'][0] ?? inputs['string']
    const is =
      action === null || action === undefined || (action as string).length <= 0
    console.log('found null or empty input:', is)

    this._task.closed = is ? ['false'] : ['true']
  }
}
