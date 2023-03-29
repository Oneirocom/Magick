import { hasBadWords } from 'expletives'
import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info = 'Does some basic checks'

export class ProfanityFilter extends MagickComponent<Promise<void>> {
  constructor() {
    super('Profanity Filter', {
      outputs: { true: 'option', false: 'option' },
    }, 'Text', info)

  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'Dirty', triggerSocket)
    const isFalse = new Rete.Output('false', 'Clean', triggerSocket)

    return node
    .addInput(dataInput)
      .addInput(inp)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    console.log('inputs is', inputs)
    console.log("inputs['string'] is", inputs['string'])

    const text = inputs['string'][0] as string
    const isProfane = hasBadWords(text)
    this._task.closed = isProfane ? ['false'] : ['true']
  }
}
