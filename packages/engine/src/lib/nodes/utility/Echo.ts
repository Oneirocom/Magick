// GENERATED 
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
  output: string;
}

/**
 * Returns the same output as the input.
 * @category Utility
 * @remarks This component is useful for testing purposes.
 */
export class Echo extends MagickComponent<Promise<WorkerReturn>> {

  constructor() {
    super('Echo', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Utility', 'Returns the same output as the input');
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const outp = new Rete.Output('output', 'String', stringSocket);

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp);
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
    const input = inputs.string[0] as string;

    return {
      output: input,
    };
  }
}