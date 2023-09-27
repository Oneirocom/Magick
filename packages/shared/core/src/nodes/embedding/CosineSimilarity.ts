// DOCUMENTED
/**
 * Computes the cosine similarity between two embeddings.
 */
import similarity from 'compute-cosine-similarity'
import Rete from 'shared/rete'
import { MagickComponent } from '../../engine'
import { embeddingSocket, numberSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * Class for computing the cosine similarity between two embeddings.
 */
export class CosineSimilarity extends MagickComponent<
  Promise<{ similarity: number } | void>
> {
  /**
   * Constructs an instance of the CosineSimilarity class.
   */
  constructor() {
    super(
      'Cosine Similarity',
      {
        outputs: {
          similarity: 'output',
          trigger: 'option',
        },
      },
      'AI/Embeddings',
      'Takes two embedding inputs and returns the cosine similarity between them.'
    )
  }

  /**
   * Builds the Rete node for computing the cosine similarity.
   * @param node The Rete node to add the inputs and outputs to.
   * @returns The node with the inputs and outputs added.
   */
  builder(node: MagickNode): MagickNode {
    const embeddingInputA = new Rete.Input(
      'embeddingA',
      'Embedding A',
      embeddingSocket
    )
    const embeddingInputB = new Rete.Input(
      'embeddingB',
      'Embedding B',
      embeddingSocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('similarity', 'Similarity', numberSocket)

    return node
      .addInput(dataInput)
      .addInput(embeddingInputA)
      .addInput(embeddingInputB)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  /**
   * Computes the cosine similarity between the two embeddings and returns it.
   * @param node The worker node data.
   * @param inputs The worker inputs.
   * @param _outputs The worker outputs.
   * @param _args Additional arguments.
   * @returns An object with the computed similarity or void if something went wrong.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
    // { projectId, module }: { projectId: string; module: any }
  ): Promise<{ similarity: number } | void> {
    const x = inputs.embeddingA[0] as string
    const y = inputs.embeddingB[0] as string

    const s = similarity(x, y)

    return { similarity: s }
  }
}
