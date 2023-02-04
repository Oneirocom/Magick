/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { booleanSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `Boolean Variable`

type InputReturn = {
  output: boolean
}

export class BooleanVariable extends MagickComponent<InputReturn> {
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

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', booleanSocket)
    const _var = new BooleanControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
      component: 'switch',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    const _public = new BooleanControl({
      dataKey: 'Public',
      name: 'Public',
    })

    node.inspector.add(name).add(_var).add(_public)

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    const _var = node?.data?._var == true

    this.name =
      (node?.data?.name as string) + '_' + Math.floor(Math.random() * 1000)
    if (_var) node.display('TRUE')
    else node.display('FALSE')

    return {
      output: _var,
    }
  }
}
