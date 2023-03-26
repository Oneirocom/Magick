/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { anySocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, MagickWorkerOutputs, WorkerData } from '../../types'
const info = `Text Variable`

type InputReturn = {
  output: string
}

export class TextVariable extends MagickComponent<InputReturn> {
  constructor() {
    super('Text Variable', {
      outputs: {
        output: 'output',
      },
    }, 'Text', info)

    this.display = true
  }

  builder(node: MagickNode) {
    if (!node.data.fewshot) node.data.fewshot = ''
    const out = new Rete.Output('output', 'output', anySocket)

    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
    })

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl).add(name).add(_public)

    return node.addOutput(out)
  }

  worker(node: WorkerData, _inputs: MagickWorkerInputs, _outputs: MagickWorkerOutputs, context: { module: { publicVariables: string } }) {
    let text = node.data.fewshot as string
    const publicVars = JSON.parse(context.module.publicVariables)
    if(node?.data?.isPublic && publicVars[node.id]) {
      console.log('publicVars[node.id is', publicVars[node.id])
      text = publicVars[node.id].value
    }

    return {
      output: text,
    }
  }
}
