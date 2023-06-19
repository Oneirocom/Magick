// DOCUMENTED 
/**
 * A class that represents a component that retrieves trivia information about a movie using its ID from the IMDb database.
 * @extends MagickComponent
 */
import Rete from 'rete'
import imdbTrivia from 'imdb-trivia'
import { NodeData } from 'rete/types/core/data'

import {
  anySocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  stringSocket,
  triggerSocket,
} from '@magickml/core'

const info = 'Returns the same output as the input'

interface WorkerReturn {
  output: string
}

export class MovieTrivia extends MagickComponent<Promise<WorkerReturn>> {

  /**
   * Initializes a new instance of the MovieTrivia class.
   */
  constructor() {
    super('Movie Trivia')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Esoterica'
    this.info = info
  }

  /**
   * A function that builds the component's node.
   * @param node - The node to be built.
   * @returns The node with inputs and outputs added to it.
   */
  builder(node: MagickNode): MagickNode {
    const movie = new Rete.Input('movie', 'Movie ID', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(dataInput)
      .addInput(movie)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * A function that retrieves the trivia information about a movie specified by its ID from the IMDb database.
   * @param node - The node object from which the function was called.
   * @param inputs - The inputs of the function.
   * @param _outputs - The outputs of the function that will not be used.
   * @returns An object containing the output as a stringified JSON.
   */
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
  ): Promise<WorkerReturn> {
    const movie = inputs.movie && inputs.movie[0]

    const promise = new Promise((resolve, reject) => {
      imdbTrivia(movie, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.trivia)
        }
      })
    })

    const returned = await promise

    return {
      output: JSON.stringify(returned),
    }
  }
}