/* eslint-disable @typescript-eslint/no-inferrable-types */
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
} from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'InputsToJSON runs JSON.stringify on the inputs and returns the result'

type WorkerReturn = {
  output: string
}

export class InputsToJSON extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Inputs To JSON')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Utility'
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

    node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)

    node.inspector.add(inputGenerator)

    return node
  }

  async worker(_node: NodeData, rawInputs: MagickWorkerInputs) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const data: { [key: string]: any } = {}
    for (const x in inputs) {
      data[x.toLowerCase().trim()] = inputs[x]
    }

    return {
      output: JSON.stringify(data),
    }
  }
}
