import Rete from 'shared/rete'
import {
  MagickNode,
  MagickWorkerInputs,
  stringSocket,
  triggerSocket,
  MagickComponent,
  WorkerData,
  MagickWorkerOutputs,
  ModuleContext,
  arraySocket,
} from '@magickml/core'

import { makeMetaphorSearch } from '../functions/SearchMetaphor'

const info = `Searches Metaphor for a query.`

type WorkerReturn = {
  results?: any[]
  message?: string
}

/**
 * Search Google component.
 * @extends MagickComponent<Promise<WorkerReturn>>
 */
export class SearchMetaphor extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for SearchMetaphor component.
   */
  constructor() {
    super(
      'Search Metaphor',
      {
        outputs: {
          results: 'output',
          message: 'output',
          trigger: 'option',
        },
      },
      'Invoke/Search',
      info
    )
  }

  /**
   * Builds the SearchMetaphor node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - A MagickNode with configured inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const query = new Rete.Input('query', 'Query', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const results = new Rete.Output('results', 'Results', arraySocket)
    const message = new Rete.Output('message', 'Message', stringSocket)

    return node
      .addInput(triggerIn)
      .addInput(query)
      .addOutput(triggerOut)
      .addOutput(results)
      .addOutput(message)
  }

  /**
   * Main worker function, executes the business logic of the component.
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - The inputs to the worker.
   * @returns {Promise<WorkerReturn>} - A promise resolving to the worker result.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const { success, results, message, error } = await makeMetaphorSearch({
      node,
      inputs,
      outputs,
      context,
    })

    if (!success) {
      throw new Error(error || 'No error message returned.')
    }

    return {
      results,
      message,
    }
  }
}
