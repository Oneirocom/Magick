/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Is Null Or Undefined checks if the input is null or undefined'

export class IsNullOrUndefined extends MagickComponent<Promise<void>> {
  constructor() {
    super('Is Null Or Undefined')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Logic'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(_node: NodeData, inputs: MagickWorkerInputs) {
    const action = inputs['string'][0] ?? inputs['string']
    const is =
      action === null || action === undefined || (action as string).length <= 0
    console.log('found null or empty input:', is)

    this._task.closed = is ? ['false'] : ['true']
  }
}
