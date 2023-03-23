import Rete from 'rete'

import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { objectSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info =
  'ComposeObject runs JSON.stringify on the inputs and returns the result'

type WorkerReturn = {
  output: Object
}

export class ComposeObject extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Compose Object', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Object', info)

    this.display = true
  }

  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Object', objectSocket)

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

  async worker(_node: WorkerData, rawInputs: MagickWorkerInputs) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const data: { [key: string]: any } = {}
    for (const x in inputs) {
      data[x.toLowerCase().trim()] = inputs[x]
    }

    return {
      output: data,
    }
  }
}
