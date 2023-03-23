import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  WorkerData,
} from '../../types'

const info =
  'Combine Text is used to add two strings together - Add a new socket with the string and the value like this - Agent Replacer (will replace all the $agent from the input with the input assigned)'

type WorkerReturn = {
  output: string
}

export class CombineText extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Combine Text', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Text', info)
    this.display = true
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    const delimiter = new InputControl({
      dataKey: 'delimiter',
      name: 'Delimiter',
      icon: 'moon',
    })

    node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)

    node.inspector
      .add(inputGenerator)
      .add(delimiter)

    return node
  }

  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    let input = ''
    console.log('combining input:', input)
    for (const x in inputs) {
      if (x !== 'trigger') {
        input += inputs[x]
      }
      // if this isn't the last input, add the delimiter
      if (x !== 'trigger' && x !== Object.keys(inputs).pop()) {
        input += _node.data.delimiter
      }
    }

    console.log('new string combined:', input)

    return {
      output: input,
    }
  }
}
