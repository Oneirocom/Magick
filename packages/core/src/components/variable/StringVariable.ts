/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { anySocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info = `String Variable`

type InputReturn = {
  output: string
}

export class StringVariable extends ThothComponent<InputReturn> {
  constructor() {
    super('String Variable')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.category = 'Variable'
    this.info = info
    this.display = true
  }

  builder(node: ThothNode) {
    const out = new Rete.Output('output', 'output', anySocket)
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Variable',
      icon: 'moon',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    node.inspector.add(name).add(_var)

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    const _var = node?.data?._var as string

    this.name = node?.data?.name as string

    return {
      output: _var,
    }
  }
}
