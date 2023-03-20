import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket, arraySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { InputControl } from '../../dataControls/InputControl'

const info = 'Returns the same output as the input'

type WorkerReturn = {
  output: string
}

export class GetValueFromArray extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Echo')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Arrays'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('array', 'Array', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    const element = new InputControl({
      dataKey: 'element',
      name: 'Element',
      defaultValue: 0
    })

    node.inspector.add(element)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  // eslint-disable-next-line @typescript-eslint/require-await, require-await
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const input = inputs.array[0] as string
    // TODO: Check if node.data is defined instead of using as keyword
    // const element = node.data.element as number
    const element = (node.data as {element:number}).element

    const arrayElement = input[element]

    return {
      output: arrayElement,
    }
  }
}
