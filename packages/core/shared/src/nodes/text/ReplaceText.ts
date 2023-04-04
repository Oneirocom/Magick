// DOCUMENTED 
/*
 * Rete Replace Text Component
 * This component replaces a string with another in the input.
 */

import Rete from 'rete';

import { InputControl } from '../../dataControls/InputControl';
import { MagickComponent } from '../../engine';
import { stringSocket, triggerSocket } from '../../sockets';
import {
  MagickNode,
  MagickWorkerInputs,
  WorkerData,
} from '../../types';

/**
 * Information about the Replace Text component.
 */
const info = 'Replace Text is used to replace one string with another. Useful for variable injection.';

/**
 * Type for worker return data.
 */
type WorkerReturn = {
  output: string;
};

/**
 * Replace Text class.
 * This class represents the Replace Text component in the Node Editor.
 * Includes builder and worker functions.
 */
export class ReplaceText extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Replace Text constructor.
   * Initializes the component with its name and sockets.
   */
  constructor() {
    super('Replace Text', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Text', info);
  }

  /**
   * Builder function for the component.
   * Sets up the UI and the inputs/outputs.
   * @param node {MagickNode} The node being built.
   */
  builder(node: MagickNode) {
    // Add input controls
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    });
    const match = new InputControl({
      dataKey: 'match',
      name: 'Match',
      icon: 'moon',
    });
    const replace = new InputControl({
      dataKey: 'replace',
      name: 'Replace',
      icon: 'moon',
    });

    node.inspector.add(name).add(match).add(replace);

    // Add sockets
    const strInput = new Rete.Input('input', 'Input', stringSocket);
    const agentInput = new Rete.Input('match', 'Match', stringSocket);
    const speakerInput = new Rete.Input('replace', 'Replace', stringSocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const outp = new Rete.Output('output', 'output', stringSocket);

    // Add input and output sockets to the node
    return node
      .addInput(dataInput)
      .addInput(strInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(outp);
  }

  /**
   * Worker function for the component.
   * Performs the string replacement operation.
   * @param node {WorkerData} The node data.
   * @param rawInputs {MagickWorkerInputs} The raw inputs to the component.
   */
  async worker(node: WorkerData, rawInputs: MagickWorkerInputs) {
    let input = rawInputs['input'][0] as string;

    const match = ((rawInputs['match'] && rawInputs['match'][0]) ||
      node?.data?.match) as string;
    const replace = ((rawInputs['replace'] && rawInputs['replace'][0]) ||
      node?.data?.replace) as string;

    try {
      input = input.replaceAll(match, replace ?? '');
    } catch {
      console.error('Replace Text Error');
    }

    return {
      output: input,
    };
  }
}