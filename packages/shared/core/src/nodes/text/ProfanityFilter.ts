// DOCUMENTED
import Rete from 'shared/rete'
import { hasBadWords } from 'expletives'

import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/**
 * Represents a profanity filter component.
 */
export class ProfanityFilter extends MagickComponent<Promise<void>> {
  /**
   * Creates an instance of ProfanityFilter.
   */
  constructor() {
    super(
      'Profanity Filter',
      {
        outputs: { true: 'option', false: 'option' },
      },
      'Data/Text',
      'Takes a string input and checks it against a set of profanity rules, then triggers the appropriate output.'
    )
  }

  /**
   * Builds the node.
   * @param node - The node to build.
   */
  builder(node: MagickNode): MagickNode {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'Dirty', triggerSocket)
    const isFalse = new Rete.Output('false', 'Clean', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  /**
   * Filters profanity.
   * @param node - The worker data.
   * @param inputs - The inputs.
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs): Promise<void> {
    const text = inputs['string'][0] as string
    const isProfane = hasBadWords(text)
    if (node?._task) node._task.closed = isProfane ? ['false'] : ['true']
  }
}
