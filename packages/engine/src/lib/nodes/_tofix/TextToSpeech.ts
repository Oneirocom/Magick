// GENERATED 
/**
 * Disables lint rules for this file.
 */
/* eslint-disable no-async-promise-executor, camelcase, @-eslint/no-inferrable-types, no-console, require-await, @typescript-eslint/no-unused-vars */

import axios, { AxiosResponse } from 'axios';
import Rete from 'rete';

import { API_ROOT_URL } from '../../config';
import { InputControl } from '../../dataControls/InputControl';
import { MagickComponent } from '../../engine';
import { anySocket, stringSocket, triggerSocket } from '../../sockets';
import {
  MagickNode,
  MagickWorkerInputs,
  WorkerData
} from '../../types';

const info = 'Returns the input string as voice';

type WorkerReturn = {
  output: string | undefined;
};

/**
 * TextToSpeech class representing a text-to-speech component.
 * It receives the input string and returns the voice synthesis of the text.
 */
export class TextToSpeech extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Text to Speech', {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }, 'Generation', info);

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
    };

  }

  /**
   * Initializes the TextToSpeech component.
   * Adds inputs and outputs to the component's node.
   * @param {MagickNode} node - The node representing TextToSpeech component.
   * @returns {MagickNode} - The node with added inputs and outputs.
   */
  builder(node: MagickNode) {
    const textInput = new Rete.Input('input', 'Input', anySocket, true);
    const voiceProviderInp = new Rete.Input(
      'voiceProvider',
      'Voice Provider',
      stringSocket,
      true
    );
    const characterInp = new Rete.Input('character', 'Character', stringSocket);
    const languageCodeInp = new Rete.Input(
      'languageCode',
      'Language Code',
      stringSocket
    );
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    );
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const outp = new Rete.Output('output', 'output', stringSocket);

    const tiktalknet_url = new InputControl({
      dataKey: 'tiktalknet_url',
      name: 'Tiktalknet URL',
    });

    node.inspector.add(tiktalknet_url);

    return node
      .addInput(triggerInput)
      .addInput(textInput)
      .addInput(voiceProviderInp)
      .addInput(characterInp)
      .addInput(languageCodeInp)
      .addOutput(dataOutput)
      .addOutput(outp);
  }

  /**
   * The worker function for the TextToSpeech component.
   * It takes inputs, makes a request to server, and returns the voice synthesis of the input text.
   * @param {WorkerData} node - The node data for the TextToSpeech component.
   * @param {MagickWorkerInputs} inputs - An object containing the input values for the TextToSpeech component.
   * @returns {Promise<WorkerReturn>} - A promise containing the voice synthesis of the input text.
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    console.log('INPUTS:', inputs);
    const action = inputs['input'][0];
    const voiceProvider = inputs['voiceProvider'][0];
    const character = inputs['character']?.[0] as string;
    const languageCode = inputs['languageCode']?.[0] as string;
    const tiktalknet_url = node.data?.tiktalknet_url as string;

    const isCommand = (action as string).startsWith('/');

    let url: AxiosResponse<string> | undefined = undefined;

    if (!isCommand && action) {
      url = await axios.get<string>(`${API_ROOT_URL}/text_to_speech`, {
        params: {
          text: action,
          voice_provider: voiceProvider,
          voice_character: character,
          voice_language_code: languageCode,
          tiktalknet_url: tiktalknet_url,
        },
      });
    }
 
    return {
      output: isCommand ? (action as string) : (url?.data),
    };
  }
}