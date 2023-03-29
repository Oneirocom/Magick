/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { stringSocket } from '../../sockets'
import { MagickNode, WorkerData } from '../../types'

const info = `String Variable`

type InputReturn = {
  output: string
}

export class StringVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('String Variable', {
      outputs: {
        output: 'output',
      },
    }, 'Text', info)

  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', stringSocket)
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
    })
    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
    })

    node.inspector.add(nameControl).add(_var).add(_public)

    return node.addOutput(out)
  }

  worker(node: WorkerData, _inputs, _outputs, context: { module: { publicVariables: string } }) {
    let _var = node?.data?._var as string
    const publicVars = JSON.parse(context.module.publicVariables)
    if(node?.data?.isPublic && publicVars[node.id]) {
      _var = publicVars[node.id].value
    }

    return {
      output: _var,
    }
  }
}
