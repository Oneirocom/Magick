// DOCUMENTED 
/**
 * A simple rete component that returns the same output as the input.
 * @category Utility
 */
import Rete from 'rete';

import { MagickComponent } from '../../engine';
import { stringSocket, triggerSocket } from '../../sockets';
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types';

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  string: string;
  timestamp: number;
}

/**
 * Returns the current time.
 * @category Utility
 */
export class CurrentTime extends MagickComponent<Promise<WorkerReturn>> {

  constructor() {
    super('Current Time', {
      outputs: {
        string: 'output',
        timestamp: 'output',
        trigger: 'option',
      },
    }, 'Utility', 'Returns the current time');
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const outp = new Rete.Output('string', 'String', stringSocket);
    const timestamp = new Rete.Output('timestamp', 'Timestamp', stringSocket);


    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
      .addOutput(timestamp);
  }

  /**
   * The worker function for the Echo node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the same string as the input.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ): Promise<WorkerReturn> {
    const timestamp = Date.now();
    const timeAsString = new Date(timestamp).toLocaleString();
    return {
      string: timeAsString,
      timestamp,
    };
  }
}