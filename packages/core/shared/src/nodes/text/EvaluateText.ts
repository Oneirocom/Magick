// DOCUMENTED
import Rete from 'rete'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'

/** Pre-defined fewshot template */
const fewshot = ''

/** Information string for Evaluate Text component */
const info =
  'Evaluate Text - options: includes, not includes, equals, not equals, starts with, not starts with, ends with, not ends with'

/**
 * A class that represents an Evaluate Text component.
 * @extends {MagickComponent<Promise<void>>}
 */
export class EvaluateText extends MagickComponent<Promise<void>> {
  /**
   * Creates an instance of EvaluateText.
   */
  constructor() {
    super(
      'Evaluate Text',
      {
        outputs: { true: 'option', false: 'option', output: 'output' },
      },
      'Text',
      info
    )
  }

  /**
   * The builder function for the Evaluate Text node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - The built node with inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    if (!node.data.fewshot) node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const operationTypes = [
      'includes',
      'not includes',
      'equals',
      'not equals',
      'starts with',
      'not starts with',
      'ends with',
      'not ends with',
    ]

    const operationType = new DropdownControl({
      name: 'Operation Type',
      dataKey: 'operationType',
      values: operationTypes,
      defaultValue: operationTypes[0],
    })

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl).add(operationType)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  /**
   * Worker function to process the Evaluate Text node.
   * @param {WorkerData} node - The node data.
   * @param {MagickWorkerInputs} inputs - The node inputs.
   * @returns {Promise<void>}
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs): Promise<void> {
    const action = inputs['string'][0] as string
    const fewshot = (node.data.fewshot as string).trim()
    const operationTypeData = node?.data?.operationType as string
    const operationType =
      operationTypeData !== undefined && operationTypeData.length > 0
        ? operationTypeData.toLowerCase().trim()
        : 'includes'
    let is = false

    switch (operationType) {
      case 'includes':
        is = action.includes(fewshot)
        break
      case 'not includes':
        is = !action.includes(fewshot)
        break
      case 'equals':
      case 'equal':
      case '===':
      case '==':
        is = action === fewshot
        break
      case 'not equals':
      case 'not equal':
      case '!==':
      case '!=':
        is = action !== fewshot
        break
      case 'starts with':
      case 'startsWith':
        is = action.startsWith(fewshot)
        break
      case 'not starts with':
      case 'not startsWith':
        is = !action.startsWith(fewshot)
        break
      case 'ends with':
      case 'endsWith':
        is = action.endsWith(fewshot)
        break
      case 'not ends with':
      case 'not endsWith':
        is = !action.endsWith(fewshot)
        break
    }

    this._task.closed = is ? ['false'] : ['true']
  }
}
