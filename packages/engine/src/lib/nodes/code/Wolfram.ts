import axios from 'axios';
import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { arraySocket, objectSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types'

async function getWolframAlphaImages(query) {
    return [query]
}

  
const info =
  'Wolfram'

type WorkerReturn = {
  output: string[]
}

export class Wolfram extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Wolfram')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Code'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const input = new Rete.Input('input', 'String', stringSocket)
    const output = new Rete.Output('output', 'Object', arraySocket)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    const str = rawInputs.input[0] as string
    let img_url = await getWolframAlphaImages("Distance to Mars")
    console.log(img_url)
    return {
      output: img_url,
    }
  }
}
