/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `String Variable`

type InputReturn = {
  output: string
}

export class StringVariable extends MagickComponent<InputReturn> {
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

    node.inspector.add(name).add(_var)

    return node.addOutput(out)
  }

  worker(node: NodeData){
  
    const _var = node?.data?._var as string

    this.name = (node?.data?.name as string) + '_' + Math.floor(Math.random()*1000)
    
    node.display("\""+ _var+ "\"");

    return {
      output: _var,
    }
  }
}
