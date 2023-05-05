// DOCUMENTED 
import Rete from 'rete';
import nameToImdb from 'name-to-imdb';
import { NodeData } from 'rete/types/core/data'

import {
  anySocket,
  triggerSocket,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  stringSocket,
} from '@magickml/core';

/**
 * Info to be displayed about the component in the application.
 */
const info = 'Returns the IMDB ID of the input movie title.';

/**
 * The data returned by the worker function.
 */
type WorkerReturn = {
  output: string;
}

/**
 * A component that takes a string input of a movie title and returns its IMDB ID.
 */
export class MovieTitleToID extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Movie Title to ID');

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    };

    this.category = 'Esoterica';
    this.info = info;
  }

  /** Builds the node for the component. */
  builder(node: MagickNode) {
    const movie = new Rete.Input('movie', 'Movie Title', stringSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const outp = new Rete.Output('output', 'Output', anySocket);

    return node
      .addInput(dataInput)
      .addInput(movie)
      .addOutput(dataOutput)
      .addOutput(outp);
  }

  /**
   * The worker function that processes the input and returns the IMDB ID of the movie.
   * @param node - The data for the node.
   * @param inputs - The inputs for the component.
   * @param _outputs - The outputs for the component.
   * @returns - A Promise containing the output of type WorkerReturn.
   */
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
  ): Promise<WorkerReturn> {
    const movie = inputs.movie && inputs.movie[0]; //Get the movie input
    const returned = await nameToImdb(movie); //Use nameToImdb package to find the IMDB ID of the movie

    return {
      output: returned,
    };
  }
}