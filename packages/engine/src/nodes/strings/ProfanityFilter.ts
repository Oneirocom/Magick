/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { hasBadWords } from 'expletives'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Does some basic checks'

export class ProfanityFilter extends MagickComponent<Promise<void>> {
  constructor() {
    super('Profanity Filter')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
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

  async worker(_node: NodeData, inputs: MagickWorkerInputs) {
    console.log('inputs is', inputs)
    console.log("inputs['string'] is", inputs['string'])

    const text = inputs['string'][0] as string
    const isProfane = hasBadWords(text)
    this._task.closed = isProfane ? ['false'] : ['true']
  }
}
