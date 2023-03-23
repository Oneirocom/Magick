/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { booleanSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, MagickWorkerOutputs, WorkerData } from '../../types'

const info = `Boolean Variable`

type InputReturn = {
  output: boolean
}

export class BooleanVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('Boolean Variable')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.category = 'Boolean'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    const out = new Rete.Output('output', 'output', booleanSocket)
    const _var = new BooleanControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
      component: 'switch',
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

  worker(node: WorkerData, inputs: MagickWorkerInputs, outputs: MagickWorkerOutputs, context: { module: { publicVariables: string } }) {
    let _var = node?.data?._var === true
    const publicVars = JSON.parse(context.module.publicVariables)
    if (node?.data?.isPublic && publicVars[node.id]) {
      _var = publicVars[node.id].value
    }

    return {
      output: _var,
    }
  }
}
