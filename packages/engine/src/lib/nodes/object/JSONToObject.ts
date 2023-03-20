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
import { triggerSocket, stringSocket, objectSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'InputsToJSON runs JSON.stringify on the inputs and returns the result'

type WorkerReturn = {
  output: string
}

export class ParseJSON extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('JSON To Object')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Object'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const input = new Rete.Input('input', 'String', stringSocket)
    const output = new Rete.Output('output', 'Object', objectSocket)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  async worker(_node: NodeData, rawInputs: MagickWorkerInputs) {
    const str = rawInputs.input[0] as string

    return {
      output: JSON.parse(str),
    }
  }
}
