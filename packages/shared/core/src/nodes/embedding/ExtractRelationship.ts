// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { embeddingSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/** Brief description of the component that this file exports. */
const info =
  'Compute a relationship embedding from a combined embedding and two input embeddings'

type InputReturn = {
  embedding: number[]
}

/**
 * Create a new CreateTextEmbedding class that extends MagickComponent.
 */
export class ExtractRelationship extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super(
      'Extract Relationship',
      {
        outputs: {
          trigger: 'option',
          embedding: 'output',
        },
      },
      'AI/Embeddings',
      info
    )
  }

  /**
   * Build the CreateTextEmbedding node with necessary configuration.
   * @param node - A MagickNode instance.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const embedding1 = new Rete.Input(
      'embedding1',
      'Embedding 1',
      embeddingSocket
    )
    const embedding2 = new Rete.Input(
      'embedding2',
      'Embedding 2',
      embeddingSocket
    )

    const combinedEmbedding = new Rete.Input(
      'combinedEmbedding',
      'Combined',
      embeddingSocket
    )

    const outputEmbedding = new Rete.Output(
      'embedding',
      'Output',
      embeddingSocket
    )

    node.addInput(dataInput).addOutput(dataOutput)
    node
      .addInput(embedding1)
      .addInput(embedding2)
      .addInput(combinedEmbedding)
      .addOutput(outputEmbedding)

    return node
  }

  /**
   * Processing function for CreateTextEmbedding node.
   * @param node - A WorkerData instance.
   * @param inputs - A MagickWorkerInputs object.
   * @param outputs - A MagickWorkerOutputs object.
   * @param context - (Optional) An object to hold context data.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context?: any
  ): Promise<InputReturn> {
    // Parsing JSON if inputs are strings
    const combinedEmbedding =
      typeof inputs['combinedEmbedding'][0] === 'string'
        ? JSON.parse(inputs['combinedEmbedding'][0])
        : inputs['combinedEmbedding'][0]
    const embedding1 =
      typeof inputs['embedding1'][0] === 'string'
        ? JSON.parse(inputs['embedding1'][0])
        : inputs['embedding1'][0]
    const embedding2 =
      typeof inputs['embedding2'][0] === 'string'
        ? JSON.parse(inputs['embedding2'][0])
        : inputs['embedding2'][0]

    function relationExtractionByCombinedVectorSubtraction(
      combined,
      emb1,
      emb2
    ) {
      // Ensure the embeddings have the same dimensions
      if (combined.length !== emb1.length || combined.length !== emb2.length) {
        throw new Error('Embeddings must have the same dimensions.')
      }

      // Perform vector subtraction
      const relationshipEmbedding = combined.map(
        (value, index) => value - (emb1[index] + emb2[index])
      )

      return relationshipEmbedding
    }

    const embedding = relationExtractionByCombinedVectorSubtraction(
      combinedEmbedding,
      embedding1,
      embedding2
    )

    return {
      embedding,
    }
  }
}
