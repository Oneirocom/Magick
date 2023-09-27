// DOCUMENTED
import Rete from 'shared/rete'

import { NumberControl } from '../../dataControls/NumberControl'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'

// Info message for LogicalOperator component
const info =
  'Takes two input variables and compares them based on the Operation Type property, then triggers the appropriate trigger node based on the result. Valid values for the Operation Type are equal, not equal, greater than, less than.'

// Type definition for worker return values
type WorkerReturn = {
  error: string
}

/**
 * LogicalOperator class is a MagickComponent that provides
 * logical operations for comparing two input values.
 */
export class LogicalOperator extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for LogicalOperator component.
   */
  constructor() {
    super(
      'Logical Operator',
      {
        outputs: { true: 'option', false: 'option', error: 'output' },
      },
      'Flow',
      info
    )
  }

  /**
   * Builder function to create inputs and outputs for the node.
   * @param node - The MagickNode for this component.
   * @returns - The node with added inputs and outputs.
   */
  builder(node: MagickNode) {
    const inp1 = new Rete.Input('input1', 'Input 1', stringSocket)
    const inp2 = new Rete.Input('input2', 'Input 2', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const outp = new Rete.Output('error', 'Error', stringSocket)

    const operationTypes = ['equal', 'not equal', 'greater than', 'less than']

    const operationType = new DropdownControl({
      name: 'Operation Type',
      dataKey: 'operationType',
      values: operationTypes,
      defaultValue: operationTypes[0],
      tooltip: 'this is an operation type dropdown',
    })

    const testt = new NumberControl({
      dataKey: 'testt',
      name: 'testt Type',
      icon: 'moon',
      tooltip: 'This is a number control',
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

  /**
   * Worker function to process inputs and perform logical operations.
   * @param node - The WorkerData for this component.
   * @param inputs - The input values for the component.
   * @returns - A promise containing an object with an error property.
   */
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
      } else if (operationType === 'less than') {
        is = inp1 < inp2
      }
    } catch (e) {
      error = (e as Error).message
    }

    if (node?._task) node._task.closed = is ? ['false'] : ['true']
    return {
      error: error,
    }
  }
}
