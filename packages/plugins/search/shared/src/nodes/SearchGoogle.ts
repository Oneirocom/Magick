// DOCUMENTED
/**
 * @file Search Google Component
 * @module SearchGoogle
 */

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
} from 'shared/core'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  summary: string
  links: string
}

/**
 * Search Google component.
 * @extends MagickComponent<Promise<WorkerReturn>>
 */
export class SearchGoogle extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for SearchGoogle component.
   */
  constructor() {
    super(
      'Search Google',
      {
        outputs: {
          summary: 'output',
          links: 'output',
          trigger: 'option',
        },
      },
      'Invoke/Search',
      info
    )
  }

  /**
   * Builds the SearchGoogle node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - A MagickNode with configured inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const query = new Rete.Input('query', 'Query', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const summary = new Rete.Output('summary', 'Summary', stringSocket)
    const links = new Rete.Output('links', 'Links', stringSocket)

    return node
      .addInput(triggerIn)
      .addInput(query)
      .addOutput(triggerOut)
      .addOutput(summary)
      .addOutput(links)
  }

  /**
   * Main worker function, executes the business logic of the component.
   * @param {WorkerData} _node - The worker data.
   * @param {MagickWorkerInputs} inputs - The inputs to the worker.
   * @returns {Promise<WorkerReturn>} - A promise resolving to the worker result.
   */
  async worker(
    _node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const { app } = context
    const result = await app
      .service('google-search')
      .find({ query: { query: inputs.query[0] } })

    const { summary, links } = result

    return {
      summary,
      links,
    }
  }
}
