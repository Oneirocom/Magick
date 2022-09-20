/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Logical Operator is used to compare two values - options: equal, not equal, greater than, less greater than'

type WorkerReturn = {
  error: string
}

export class LogicalOperator extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Logical Operator')

    this.task = {
      outputs: { true: 'option', false: 'option', error: 'output' },
    }

    this.category = 'Logic'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
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
      .addInput(inp1)
      .addInput(inp2)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
      .addOutput(outp)
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    const inp1 = inputs['input1'][0] as string
    const inp2 = inputs['input2'][0] as string
    const operationTypeData = node?.data?.operationType as string
    const operationType =
      operationTypeData !== undefined && operationTypeData.length > 0
        ? operationTypeData.toLowerCase().trim()
        : 'includes'
    let is: boolean = false
    let error = ''

    try {
      if (operationType === 'equal') {
        is = inp1 == inp2
      } else if (operationType === 'not equal') {
        is = inp1 != inp2
      } else if (operationType === 'greater than') {
        is = inp1 > inp2
      } else if (operationType === 'less greater than') {
        is = inp1 < inp2
      }
    } catch (e) {
      error = (e as any).message
    }

    this._task.closed = is ? ['false'] : ['true']
    return {
      error: error,
    }
  }
}
