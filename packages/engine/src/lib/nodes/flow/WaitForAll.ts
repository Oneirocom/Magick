import Rete from 'rete'

import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  WorkerData
} from '../../types'

const info = `Fires once all connected triggers have fired.`

export class WaitForAll extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Wait For All')

    this.task = {
      outputs: { default: 'option' },
    }
    this.category = 'Flow'
    this.info = info
  }

  node = {}

  builder(node: MagickNode) {
    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      socketType: 'triggerSocket',
      name: 'Input Sockets',
    })

    node.inspector.add(inputGenerator)

    const defaultOutput = new Rete.Output('default', 'Output', triggerSocket)

    node.addOutput(defaultOutput)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    const nodeInputs = Object.values(inputs as any).filter(
      (input: any) => !!input
    ) as Array<{ name: string }>

    // close all outputs
    this._task.closed = [...nodeInputs.map(out => out.name)]
  }
}
