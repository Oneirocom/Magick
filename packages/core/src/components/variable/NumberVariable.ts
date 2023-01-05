/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { numSocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info = `Number Variable`

type InputReturn = {
  output: number
}

export class NumberVariable extends ThothComponent<InputReturn> {
  constructor() {
    super('Number Variable')

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
    const out = new Rete.Output('output', 'output', numSocket)
    const _var = new NumberControl({
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
    const _var = node?.data?._var as number

    this.name = (node?.data?.name as string) + ' - ' + _var

    return {
      output: _var,
    }
  }
}
