/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { BooleanControl } from '../../dataControls/BooleanControl'

const info = `Fewshot Variable`

const fewshot = ``

type InputReturn = {
  output: string
}

export class FewshotVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('Fewshot Variable')

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
    if (!node.data.fewshot) node.data.fewshot = fewshot
    const out = new Rete.Output('output', 'output', anySocket)

    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    const _public = new BooleanControl({
      dataKey: 'Public',
      name: 'Public',
    })

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl).add(name).add(_public)

    return node.addOutput(out)
  }

  worker(node: NodeData) {
    const fewshot = node.data.fewshot as string

    this.name =
      (node?.data?.name as string) + '_' + Math.floor(Math.random() * 1000)
    //if (fewshot.length == 0) node.display('ERROR: EMPTY STRING')
    //else node.display(fewshot.substring(0, 1000) + '...')

    return {
      output: fewshot,
    }
  }
}
