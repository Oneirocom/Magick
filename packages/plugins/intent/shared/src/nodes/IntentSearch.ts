// DOCUMENTED
/**
 * A component to process Intent Search.
 * @category Intent
 */
import Rete from 'rete'
import {
  MagickComponent,
  stringSocket,
  triggerSocket,
  MagickNode,
  MagickWorkerInputs,
  ModuleContext,
  WorkerData,
  objectSocket,
  MagickWorkerOutputs,
  getLogger,
} from '@magickml/core'

import axios from 'axios'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  object: []
  output: string
}

/**
 * Returns the same output as the input.
 * @category Utility
 * @remarks This component is useful for testing purposes.
 */
export class IntentSearch extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Intent Search',
      {
        outputs: {
          output: 'output',
          object: 'object',
          trigger: 'option',
        },
      },
      'Intent',
      'Intent Search'
    )
  }

  /**
   * The builder function for the IntentSearch node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textOutput = new Rete.Output('output', 'String', stringSocket)

    return node
      .addInput(triggerInput)
      .addOutput(triggerOutput)
      .addOutput(textOutput)
  }

  /**
   * The worker function for the IntentSearch node.
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - Node inputs.
   * @param {MagickWorkerOutputs} _outputs - Node outputs.
   * @returns the intent
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    let query = ''
    if (inputs && inputs.query) {
      query = inputs.query[0] as string
    }
    const logger = getLogger()
    let token = ''
    if (context.module && context.module.secrets) {
      logger.debug(context.module.secrets)
      token = context.module.secrets['github_access_token']
    }
    logger.debug(token)

    let result = [] as []

    return {
      object: result,
      output: JSON.stringify(result),
    }
  }
}
