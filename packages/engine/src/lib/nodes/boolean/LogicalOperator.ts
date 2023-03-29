import Rete from 'rete'

import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info =
  'Logical Operator is used to compare two values - options: equal, not equal, greater than, less greater than'

type WorkerReturn = {
  error: string
}

export class LogicalOperator extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Logical Operator', {
      outputs: { true: 'option', false: 'option', error: 'output' },
    }, 'Boolean', info)
  }

  builder(node: MagickNode) {
    const inp1 = new Rete.Input('input1', 'Input 1', stringSocket)
    const inp2 = new Rete.Input('input2', 'Input 2', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const outp = new Rete.Output('error', 'Error', stringSocket)

    const operationType = new InputControl({
      dataKey: 'operationType',
      name: 'Operation Type',
      icon: 'moon',
    })

    const testt = new NumberControl({
      dataKey: 'testt',
      name: 'testt Type',
      icon: 'moon',
    })

    node.inspector.add(operationType).add(testt)

    return node
    .addInput(dataInput)
      .addInput(inp1)
      .addInput(inp2)
      .addOutput(isTrue)
      .addOutput(isFalse)
      .addOutput(outp)
  }

  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const inp1 = inputs['input1'][0] as string
    const inp2 = inputs['input2'][0] as string
    const operationTypeData = node?.data?.operationType as string
    const operationType =
      operationTypeData !== undefined && operationTypeData.length > 0
        ? operationTypeData.toLowerCase().trim()
        : 'includes'
    let is = false
    let error = ''

    try {
      if (operationType === 'equal') {
        is = inp1 === inp2
      } else if (operationType === 'not equal') {
        is = inp1 !== inp2
      } else if (operationType === 'greater than') {
        is = inp1 > inp2
      } else if (operationType === 'less greater than') {
        is = inp1 < inp2
      }
    } catch (e) {
      error = (e as Error).message
    }

    this._task.closed = is ? ['false'] : ['true']
    return {
      error: error,
    }
  }
}
