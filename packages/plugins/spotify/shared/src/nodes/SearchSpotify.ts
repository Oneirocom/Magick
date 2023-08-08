import Rete from 'rete'
import {
  MagickNode,
  MagickWorkerInputs,
  stringSocket,
  triggerSocket,
  MagickComponent,
  WorkerData,
  MagickWorkerOutputs,
  ModuleContext,
  objectSocket,
  DropdownControl,
} from '@magickml/core'
import { spotifySearch } from '../functions/spotifySearch'
import { SearchResults } from '@spotify/web-api-ts-sdk'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  results?: SearchResults
}

/**
 * spotify Google component.
 * @extends MagickComponent<Promise<WorkerReturn>>
 */
export class SearchSpotify extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for spotifyGoogle component.
   */
  constructor() {
    super(
      'Search Spotify',
      {
        outputs: {
          results: 'output',
          trigger: 'option',
        },
      },
      'Music',
      info
    )
  }

  /**
   * Builds the spotifyGoogle node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - A MagickNode with configured inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const query = new Rete.Input('query', 'Query', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const results = new Rete.Output('results', 'Results', objectSocket)

    const searchType = new DropdownControl({
      name: 'Search Type',
      dataKey: 'type',
      values: [
        'artist',
        'album',
        'playlist',
        'track',
        'show',
        'episode',
        'audiobook',
      ],
      defaultValue: 'artist',
      tooltip: 'The type of search to perform.',
    })
    node.inspector.add(searchType)
    node
      .addInput(triggerIn)
      .addInput(query)
      .addOutput(triggerOut)
      .addOutput(results)

    return node
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
    const { success, results, error } = await spotifySearch({
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
    }
  }
}
