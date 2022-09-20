/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { NodeData, ThothNode } from '../../types'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { arraySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `Array Variable`

type InputReturn = {
  output: string[]
}

export class ArrayVariable extends ThothComponent<InputReturn> {
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

  builder(node: ThothNode) {
    const out = new Rete.Output('output', 'output', arraySocket)
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Variable',
      icon: 'moon',
    })
    const splitter = new InputControl({
      dataKey: 'splitter',
      name: 'Splitter',
      icon: 'moon',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })
    const keepEmpty = new BooleanControl({
      dataKey: 'keepEmpty',
      name: 'Variable',
      icon: 'moon',
    })

    node.inspector.add(name).add(_var).add(splitter).add(keepEmpty)

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    const _var = node?.data?._var as string
    const splitter = node?.data?._var as string
    const keepEmpty = node?.data?.keepEmpty == 'true'
    const res = !keepEmpty
      ? _var.split(splitter).filter(el => el.length > 0)
      : _var.split(splitter)

    this.name = (node?.data?.name as string) + ' - ' + _var

    return {
      output: res,
    }
  }
}
