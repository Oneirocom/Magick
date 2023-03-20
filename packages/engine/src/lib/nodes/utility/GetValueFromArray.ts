/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { NumberControl } from '../../dataControls/NumberControl'
import { MagickComponent } from '../../magick-component'
import { arraySocket, objectSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, NodeData
} from '../../types'

const info =
  'Convert an object into a JSON string.'

type WorkerReturn = {
  output: string
}

export class GetValueFromArray extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Get Value From Array')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Array'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'String', objectSocket)
    const input = new Rete.Input('input', 'Object', arraySocket)

    const indexControl = new NumberControl({
      dataKey: 'indexControl',
      name: 'Index Control',
      icon: 'moon',
    })

    node.inspector.add(indexControl)

    node
      .addInput(dataInput)
      .addInput(input)
      .addOutput(dataOutput)
      .addOutput(output)

    return node
  }

  async worker(_node: NodeData, rawInputs: MagickWorkerInputs) {
    const array = rawInputs.input[0] as string

    const index = _node.data.indexControl
    const obj = array[index]

    return {
      output: obj
    }
  }
}
