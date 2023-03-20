import Rete from 'rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { MagickComponent } from '../../magick-component'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  WorkerData
} from '../../types'

const info = 'String Adder adds a string in the current input.'

type WorkerReturn = {
  output: string
}

export class StringAdder extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('String Adder')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const newInput = new Rete.Input('newInput', 'New Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const newLineStarting = new BooleanControl({
      dataKey: 'newLineStarting',
      name: 'New Line',
      icon: 'moon',
    })

    node.inspector.add(newLineStarting)

    return node
      .addInput(inp)
      .addInput(newInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const input = inputs['string'][0] as string
    const newInput = inputs['newInput'][0] as string
    const newLineStarting =
      node?.data?.newLineStarting === true ||
      node?.data?.newLineStarting === 'true'
    console.log('new output:', input + (newLineStarting ? '\n' : '') + newInput)
    const newstring = input + (newLineStarting ? '\n' : '') + newInput
    // get the last 1000 characters of newstring, if there are more than 1000 characters
    const newstringTruncated = newstring.slice(-1000)
    return {
      output: newstringTruncated,
    }
  }
}
