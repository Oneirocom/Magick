import Rete from 'rete'
import nameToImdb from 'name-to-imdb'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  stringSocket,
  triggerSocket,
} from '@magickml/engine'

const info = 'Returns the same output as the input'

type WorkerReturn = {
  output: string
}

export class MovieTitleToID extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Movie Title to ID')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Esoterica'
    this.info = info
  }

  builder(node: MagickNode) {
    const movie = new Rete.Input('movie', 'Movie Title', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(dataInput)
      .addInput(movie)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const movie = inputs.movie && inputs.movie[0] 
    const returned = await nameToImdb(movie)

    return {
      output: returned,
    }
  }
}
