/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { hasBadWords } from 'expletives'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Does some basic checks'

export class ProfanityFilter extends ThothComponent<Promise<void>> {
  constructor() {
    super('Profanity Filter')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'Dirty', triggerSocket)
    const isFalse = new Rete.Output('false', 'Clean', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    console.log('inputs is', inputs)
    console.log("inputs['string'] is", inputs['string'])

    const text = inputs['string'][0] as string
    const isProfane = hasBadWords(text)
    this._task.closed = isProfane ? ['false'] : ['true']
  }
}
