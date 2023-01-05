/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { booleanSocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info = `Boolean Variable`

type InputReturn = {
  output: boolean
}

export class BooleanVariable extends ThothComponent<InputReturn> {
  constructor() {
    super('Boolean Variable')

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
    const out = new Rete.Output('output', 'output', booleanSocket)
    const _var = new BooleanControl({
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
    const _var = node?.data?._var == true

    this.name = (node?.data?.name as string) + ' - ' + _var

    return {
      output: _var,
    }
  }
}
