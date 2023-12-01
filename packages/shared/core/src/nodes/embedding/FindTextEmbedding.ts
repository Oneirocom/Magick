// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { embeddingSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

const info =
  'Takes a string input and searches the Events store for an event with matching content. Returns the embedding for the event if a match is found.'

type InputReturn = {
  embedding: number[] | null
}

/**
 * FindTextEmbedding class extends MagickComponent and processes the given text to find cached embeddings.
 */
export class FindTextEmbedding extends MagickComponent<
  Promise<InputReturn | null>
> {
  constructor() {
    super(
      'Find Text Embedding',
      {
        outputs: {
          embedding: 'output',
          failure: 'option',
          success: 'option',
        },
      },
      'AI/Embeddings',
      info
    )
  }

  /**
   * Configure the input and output sockets for the Rete node.
   *
   * @param node - The MagickNode node to configure.
   * @returns The configured node.
   */
  builder(node: MagickNode): MagickNode {
    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const success = new Rete.Output('success', 'Success', triggerSocket)
    const fail = new Rete.Output('failure', 'Failure', triggerSocket)
    const out = new Rete.Output('embedding', 'Embedding', embeddingSocket)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addOutput(success)
      .addOutput(fail)
      .addOutput(out)
  }

  /**
   * Worker function to process the inputs and generate the output.
   *
   * @param node - Node data.
   * @param inputs - Node inputs.
   * @param _outputs - Node outputs.
   * @returns The result of the worker process.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context
  ) {
    const { app } = context.module
    if (!app) throw new Error('App is not defined, cannot delete event')

    const { projectId } = context
    const content = (inputs['content'] &&
      inputs['content'][0]) as unknown as string

    if (!content) {
      console.log('Content is null, not storing event')
      return null
    }

    const params = {
      query: {
        content: content,
        $limit: 1,
        getEmbedding: true,
        projectId: projectId,
      },
    }
    const events = await app.service('events').find(params)

    let responseData = null
    if (Array.isArray(events.events) && events.events.length > 0) {
      responseData = events.events[0]
    }

    //@ts-ignore //This is breaking event recall
    let embedding = responseData ? responseData?.embedding?.toString() : null
    // if embedding is a string, parse it to an array
    if (typeof embedding === 'string') {
      if (embedding[0] === '[') {
        embedding = JSON.parse(JSON.stringify(embedding))
      } else {
        embedding = JSON.parse(JSON.stringify('[' + embedding + ']'))
      }
    }

    // Set the task closed state based on the presence of the embedding
    if (embedding && embedding !== 'null') {
      if (node?._task) node._task.closed = ['failure']
    } else {
      if (node?._task) node._task.closed = ['success']
    }

    return {
      embedding,
    }
  }
}
