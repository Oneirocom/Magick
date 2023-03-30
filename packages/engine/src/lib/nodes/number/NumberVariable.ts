import Rete from 'rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { MagickComponent } from '../../engine'
import { numberSocket } from '../../sockets'
import { MagickNode, WorkerData } from '../../types'

const info = `Number Variable`

type InputReturn = {
  output: number
}

export class NumberVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('Number Variable', {
      outputs: {
        output: 'output',
      },
    }, 'Number', info)

  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', numberSocket)
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
      dataKey: 'isPublic',
      name: 'isPublic',
    })

    node.inspector.add(name).add(_var).add(_public)

    return node.addOutput(out)
  }

  worker(node: WorkerData, _inputs, _outputs, context: { module: { publicVariables: string } }) {
    let _var = node?.data?._var as number
    const publicVars = JSON.parse(context.module.publicVariables)
    if(node?.data?.isPublic && publicVars[node.id]) {
      _var = publicVars[node.id].value
    }

    return {
      output: _var,
    }
  }
}
