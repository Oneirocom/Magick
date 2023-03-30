// GENERATED 
/**
 * Typescript code for Speech to Text Node that uses Whisper on Banana-ML to convert speech to text.
 * Optimized and refactored according to Google code standards.
 * @packageDocumentation
 */

import Rete from 'rete';
import { MagickComponent } from '../../engine';
import { audioSocket, stringSocket, triggerSocket } from '../../sockets';
import { MagickNode, MagickWorkerInputs, MagickWorkerOutputs, WorkerData } from '../../types';

/**
 * Info about the Speech to Text node.
 */
const info = 'Speech to Text node, powered by Whisper on Banana ML';

/**
 * Interface for the return value from the builder function.
 */
interface InputReturn {
  /** Speech to text output. */
  output: unknown;
}

/**
 * An object that can run, start, and check the status of a Whisper model.
 */
let banana: null | {
  run(apiKey: string, modelKey: string, modelInputs?: object): Promise<object>;
  start(apiKey: string, modelKey: string, modelInputs?: object): Promise<string>;
  check(apiKey: string, callID: string): Promise<object>;
} = null;

/**
 * A Speech to Text Rete component that uses Whisper on Banana-ML to convert speech to text.
 */
export class SpeechToText extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Speech To Text', {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }, 'Generation', info);
  }

  /**
   * Builds the Rete node for the Speech to Text component.
   * @param node The MagickNode of the Speech to Text component.
   * @returns The modified MagickNode with added inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const audioInput = new Rete.Input('audio', 'Audio', audioSocket, true);
    const triggerInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const output = new Rete.Output('output', 'Output', stringSocket, true);

    return node
      .addInput(triggerInput)
      .addInput(audioInput)
      .addOutput(dataOutput)
      .addOutput(output);
  }

  /**
   * Processes the function of the Speech to Text component. Uses Whisper on Banana-ML to convert speech to text.
   * @param node The WorkerData of the Speech to Text component.
   * @param inputs The MagickWorkerInputs of the Speech to Text component.
   * @param _outputs The MagickWorkerOutputs of the Speech to Text component.
   * @returns The output of the Speech to Text component as a Promise.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ): Promise<InputReturn> {
    const audio = inputs['audio'] && inputs['audio'][0];
    const modelParameters = {
      mp3BytesString: audio,
    };

    if (!banana) {
      banana = await import('@banana-dev/banana-dev');
    }

    const BANANA_API_KEY = '';
    const BANANA_MODEL_KEY = '';

    const output = await banana.run(
      BANANA_API_KEY,
      BANANA_MODEL_KEY,
      modelParameters
    );

    return { output };
  }
}