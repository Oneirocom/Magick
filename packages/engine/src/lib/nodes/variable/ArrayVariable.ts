/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { NodeData, MagickNode } from '../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { arraySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `Array Variable`

type InputReturn = {
  output: string[]
}

export class ArrayVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('Array Variable')

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
    const out = new Rete.Output('output', 'output', arraySocket)
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    const _public = new BooleanControl({
      dataKey: 'Public',
      name: 'Public',
    })

    const _var = new InputControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
    })
    const splitter = new InputControl({
      dataKey: 'splitter',
      name: 'Splitter',
      icon: 'moon',
    })

    const keepEmpty = new BooleanControl({
      dataKey: 'keepEmpty',
      name: 'Keep Empty Values',
      icon: 'moon',
    })

    node.inspector.add(name).add(_var).add(splitter).add(keepEmpty).add(_public)

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    const _var = node?.data?._var as string
    const splitter = node?.data?.splitter as string
    const keepEmpty = node?.data?.keepEmpty == 'true'
    const res = !keepEmpty
      ? _var.split(splitter).filter(el => el.length > 0)
      : _var.split(splitter)

    //node.display(res.toString())
    if (res === undefined) node.display('undefined value')

    return {
      output: res,
    }
  }
}
