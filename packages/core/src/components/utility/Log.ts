import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Logs a value to the console'

export class Log extends ThothComponent<void> {
  constructor() {
    super('Log')

    this.task = {
      outputs: {
      },
    }

    this.category = 'Utility'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'Value', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Log Name',
    })

    node.inspector.add(nameControl)

    return node
      .addInput(dataInput)
      .addInput(inp)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs
  ) {
    const input = inputs.string[0] as string

    console.log(`Output from ${node.data.name || "log component"}`, input)

    return null
  }
}
