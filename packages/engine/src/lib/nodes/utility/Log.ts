import Rete from 'rete'

import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Logs a value to the console'

export class Log extends MagickComponent<void> {
  constructor() {
    super('Log')

    this.task = {
      outputs: {},
    }

    this.category = 'Utility'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'Value', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Log Name',
    })

    node.inspector.add(nameControl)

    return node.addInput(dataInput).addInput(inp)
  }

  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const input = inputs.string[0] as string

    console.log(`Output from ${node.data.name || 'log component'}`, input)

    return null
  }
}
