/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'
import {
  NodeData,
  MagickNode,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { BooleanControl } from '../../dataControls/BooleanControl'

const info = `Image Variable`

type InputReturn = {
  output: string
}

export class Image extends MagickComponent<InputReturn> {
  static Image_Val
  constructor() {
    super('Image Variable')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.category = 'utility'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', anySocket)
    const _var = new InputControl({
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

    node.inspector.add(name).add(_var).add(_public).add_img("check this")

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    const _var = node?.data?._var as string

    this.name =
      (node?.data?.name as string) + '_' + Math.floor(Math.random() * 1000)
    console.log(Image.Image_Val)
    return {
      output: node.outputs,
    }
  }
}

`
[
    'id',         'data',
    'name',       'inputs',
    'outputs',    'position',
    'unlockPool', 'busy',
    'outputData', 'console'
]
`