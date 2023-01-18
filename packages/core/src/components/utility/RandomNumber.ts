import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { numSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `Random Number generator`

type InputReturn = {
  output: number
}

export class RandomNumber extends MagickComponent<InputReturn> {
  constructor() {
    super('Random Number')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.category = 'Utility'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const _Min = new NumberControl({
      dataKey: '_Min',
      name: 'Value min',
      icon: 'moon',
    })

    const _Max = new NumberControl({
      dataKey: '_Max',
      name: 'Value max',
      icon: 'moon',
    })

    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

   

    node.inspector.add(name).add(_Min).add(_Max)
    
    node.data._Max = 100
    node.data._Min = 1

    return node.addOutput(out).addInput(dataInput)
  }

  worker(node: NodeData) {
    const _Min = node?.data?._Min as number
    const _Max = node?.data?._Min as number

    this.name = node?.data?.name as string
    let res = Math.floor(_Min + Math.random() * _Max)

    return {
      output: res,
    }
  }
}