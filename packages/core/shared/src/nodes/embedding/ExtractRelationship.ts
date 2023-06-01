// DOCUMENTED
import Rete from 'rete'

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
      'Embedding',
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
    const embeddingCombined = inputs['embeddingCombined']
    const embedding1 = inputs['embedding1']
    const embedding2 = inputs['embedding2']

    function relationExtractionByCombinedVectorSubtraction(
      embeddingCombined,
      embedding1,
      embedding2
    ) {
      // Ensure the embeddings have the same dimensions
      if (
        embeddingCombined.length !== embedding1.length ||
        embeddingCombined.length !== embedding2.length
      ) {
        throw new Error('Embeddings must have the same dimensions.')
      }

      // Perform vector subtraction
      const relationshipEmbedding = embeddingCombined.map(
        (value, index) => value - (embedding1[index] + embedding2[index])
      )

      return relationshipEmbedding
    }

    const embedding = relationExtractionByCombinedVectorSubtraction(
      embeddingCombined,
      embedding1,
      embedding2
    )

    return {
      embedding,
    }
  }
}
