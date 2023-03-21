/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
} from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { TextInputControl } from '../../dataControls/TextInputControl'
import { InputControl } from '../../dataControls/InputControl'

const info =
  'Combine Text is used to add two strings twogether - Add a new socket with the string and the value like this - Agent Replacer (will replace all the $agent from the input with the input assigned)'

type WorkerReturn = {
  output: string
}

export class CombineText extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Combine Text')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Text'
    this.display = true
    this.info = info
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

  async worker(_node: NodeData, rawInputs: MagickWorkerInputs) {
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
