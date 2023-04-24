// DOCUMENTED 
import Rete from 'rete';

import { MagickComponent } from '../../engine';
import { arraySocket, stringSocket, triggerSocket } from '../../sockets';
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types';

const info = 'Get a cached embedding for this exact string';

type InputReturn = {
  embedding: number[] | null;
};

interface ResponseData {
  embedding: number[] | string;
}


/**
 * FindTextEmbedding class extends MagickComponent and processes the given text to find cached embeddings.
 */
export class FindTextEmbedding extends MagickComponent<Promise<InputReturn | null>> {
  constructor() {
    super('Find Text Embedding', {
      outputs: {
        embedding: 'output',
        failure: 'option',
        success: 'option',
      },
    }, 'Embedding', info);
  }

  /**
   * Configure the input and output sockets for the Rete node.
   *
   * @param node - The MagickNode node to configure.
   * @returns The configured node.
   */
  builder(node: MagickNode): MagickNode {
    const contentInput = new Rete.Input('content', 'Content', stringSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const success = new Rete.Output('success', 'Success', triggerSocket);
    const fail = new Rete.Output('failure', 'Failure', triggerSocket);
    const out = new Rete.Output('embedding', 'Embedding', arraySocket);

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addOutput(success)
      .addOutput(fail)
      .addOutput(out);
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
      const { app } = context.module;
      if (!app) throw new Error('App is not defined, cannot delete event');
    
      const { projectId } = context;
      const content = (inputs['content'] && inputs['content'][0]) as unknown as string;
    
      if (!content) {
        console.log('Content is null, not storing event');
        return null;
      }
    
      const params = {
        content: content,
        $limit: 1,
        getEmbedding: true,
        projectId: projectId,
      };
      const events = await app.service('events').find(params);
    
      console.log('found text embedding events', events);
    
      let responseData: ResponseData | null = null;
      if (Array.isArray(events.events) && events.events.length > 0) {
        responseData = events.events[0];
      }
    
      let embedding = responseData ? responseData.embedding : null;
      // if embedding is a string, parse it to an array
      if (typeof embedding === 'string') {
        if (embedding[0] === '[') {
          embedding = JSON.parse(embedding) as number[];
        } else {
          embedding = JSON.parse("[" + embedding + "]") as number[];
        }
      }
      // Set the task closed state based on the presence of the embedding
      if (embedding) {
        this._task.closed = ['failure'];
      } else {
        this._task.closed = ['success'];
      }
    
      return {
        embedding,
      };
    }
}