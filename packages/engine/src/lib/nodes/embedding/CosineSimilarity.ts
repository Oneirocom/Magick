import similarity from 'compute-cosine-similarity'
import Rete from 'rete'
import { MagickComponent } from '../../engine'
import { embeddingSocket, numberSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

const info = 'Event Store is used to store events for an event and user'

type InputReturn = {
  similarity: number
} | void

export class CosineSimilarity extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Cosine Similarity', {
      outputs: {
        similarity: 'output',
        trigger: 'option',
      },
    }, 'Embedding', info)

  }

  builder(node: MagickNode) {
    const embeddingInputA = new Rete.Input('embeddingA', 'Embedding A', embeddingSocket)
    const embeddingInputB = new Rete.Input('embeddingB', 'Embedding B', embeddingSocket)
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

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    // { projectId, module }: { projectId: string; module: any }
  ) {
    const x = inputs.embeddingA[0] as string
    const y = inputs.embeddingB[0] as string

    const s = similarity( x, y );

    return {
        similarity: s,
    }

  }
}
