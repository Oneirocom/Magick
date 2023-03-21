import Rete from 'rete'

import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../magick-component'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs, NodeData
} from '../../types'

const fewshot = ``

const info =
  'Evaluate Text - options: includes, not includes, equals, not equals, starts with, not starts with, ends with, not ends with'

export class EvaluateText extends MagickComponent<Promise<void>> {
  constructor() {
    super('Evaluate Text')

    this.task = {
      outputs: { true: 'option', false: 'option', output: 'output' },
    }

    this.category = 'Text'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    if (!node.data.fewshot) node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    const operationType = new InputControl({
      dataKey: 'operationType',
      name: 'Operation Type',
      icon: 'moon',
    })

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl).add(operationType)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(node: NodeData, inputs: MagickWorkerInputs) {
    const action = inputs['string'][0] as string
    const fewshot = (node.data.fewshot as string).trim()
    const operationTypeData = node?.data?.operationType as string
    const operationType =
      operationTypeData !== undefined && operationTypeData.length > 0
        ? operationTypeData.toLowerCase().trim()
        : 'includes'
    let is = false

    if (operationType === 'includes') {
      is = action.includes(fewshot)
    } else if (operationType === 'not includes') {
      is = !action.includes(fewshot)
    } else if (operationType === 'equals' || operationType ==='equal' || operationType === '===' || operationType === '==') {
      is = action === fewshot
    } else if (operationType === 'not equals' || operationType ==='not equal' || operationType === '!==' || operationType === '!=') {
      is = action !== fewshot
    } else if (operationType === 'startsWith' || operationType === 'starts with') {
      is = action.startsWith(fewshot)
    } else if (operationType === 'not startsWith' || operationType === 'not starts with') {
      is = !action.startsWith(fewshot)
    } else if (operationType === 'endsWith' || operationType === 'ends with') {
      is = action.endsWith(fewshot)
    } else if (operationType === 'not endsWith' || operationType === 'not ends with') {
      is = !action.endsWith(fewshot)
    }

    this._task.closed = is ? ['false'] : ['true']
  }
}
