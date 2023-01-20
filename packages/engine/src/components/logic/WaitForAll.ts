import Rete from 'rete'

import {
  DataSocketType,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
} from '../../types'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `Fires once all connected triggers have fired.`

export class WaitForAll extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Wait For All')

    this.task = {
      outputs: { default: 'option' },
    }
    this.category = 'Logic'
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
  worker(_node: NodeData, inputs: MagickWorkerInputs) {
    const nodeInputs = Object.values(inputs as any).filter(
      (input: any) => !!input
    ) as DataSocketType[]

    // close all outputs
    this._task.closed = [...nodeInputs.map(out => out.name)]
  }
}
