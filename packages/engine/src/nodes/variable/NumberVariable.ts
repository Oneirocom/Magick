/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { NodeData, MagickNode } from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { numSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { BooleanControl } from '../../dataControls/BooleanControl'

const info = `Number Variable`

type InputReturn = {
  output: number
}

export class NumberVariable extends MagickComponent<InputReturn> {
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

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', numSocket)
    const _var = new NumberControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
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
    const _var = node?.data?._var as number

    this.name =
      (node?.data?.name as string) + '_' + Math.floor(Math.random() * 1000)

    // TODO: need to be fixed, issue of loosing display() function from NodeData context
    // node.display(_var.toString())

    return {
      output: _var,
    }
  }
}
