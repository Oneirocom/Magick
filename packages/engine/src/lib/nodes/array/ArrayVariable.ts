// TODO: Currently array variable is not working. Need to fix this.
import Rete from 'rete'

import { MagickNode, WorkerData } from '../../types'
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
    super('Array Variable', {
      outputs: {
        output: 'output',
      },
    }, 'Array', info)

    this.display = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', arraySocket)
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    // const _public = new BooleanControl({
    //   dataKey: 'isPublic',
    //   name: 'isPublic',
    // })

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

    node.inspector.add(name).add(_var).add(splitter).add(keepEmpty)
    // .add(_public)

    return node.addOutput(out)
  }

  worker(node: WorkerData) {
    const _var = node?.data?._var as string
    const splitter = node?.data?.splitter as string
    const keepEmpty = node?.data?.keepEmpty === 'true'
    const res = !keepEmpty
      ? _var.split(splitter).filter(el => el.length > 0)
      : _var.split(splitter)

    return {
      output: res,
    }
  }
}
