/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  EngineContext,
  MagickNodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket, objectSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'Convert an object into a JSON string.'

type WorkerReturn = {
  output: string
}

export class ObjectToJSON extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Object To JSON')

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
    const output = new Rete.Output('output', 'String', stringSocket)
    const input = new Rete.Input('input', 'Object', objectSocket)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    const obj = rawInputs.input[0] as string

    return {
      output: JSON.stringify(obj),
    }
  }
}
