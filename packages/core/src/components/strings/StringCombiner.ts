/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'String Combiner is used to replace a value in the string with something else - Add a new socket with the string and the value like this - Agent Replacer (will replace all the $agent from the input with the input assigned)'

type WorkerReturn = {
  output: string
}

export class StringCombiner extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('String Combiner')

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

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    node.inspector.add(inputGenerator)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(_node: NodeData, rawInputs: ThothWorkerInputs) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    let input = inputs['string'] as string
    console.log('combining input:', input)
    for (const x in inputs) {
      if (x.toLowerCase().includes('replacer')) {
        console.log(
          'replacing: $',
          x.split(' ')[0].toLowerCase().trim(),
          'with:',
          inputs[x]
        )
        input = input.replace(
          '$' + x.split(' ')[0].toLowerCase().trim(),
          inputs[x] as string
        )
      }
    }

    console.log('new string combined:', input)

    return {
      output: input,
    }
  }
}
