// GENERATED 
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @-eslint/no-unused-vars */
import Rete from 'rete';

import { MagickComponent } from '../../engine';
import { anySocket, triggerSocket } from '../../sockets';
import {
  MagickNode,
  MagickWorkerInputs, WorkerData
} from '../../types';

/**
 * Describes the IsVariableTrue component which checks if the input is true.
 * Strings or booleans are checked as true or false.
 * Numbers are checked as 0 or 1.
 * Undefined or null are checked as false.
 */
export class IsVariableTrue extends MagickComponent<void> {
  /**
   * Initializes a new instance of the IsVariableTrue component.
   */
  constructor() {
    super('Is Variable True', {
      outputs: { true: 'option', false: 'option' },
    }, 'Boolean', 'Is Variable true checks if input is true - string or boolean are checked as true or false, numbers are checked as 0 or 1, undifined or null are checked as false');
  }

  /**
   * Builds the IsVariableTrue node.
   * @param node - The node to be built.
   * @returns The built node.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('input', 'Input', anySocket);
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const isTrue = new Rete.Output('true', 'True', triggerSocket);
    const isFalse = new Rete.Output('false', 'False', triggerSocket);

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse);
  }

  /**
   * Processes the worker node.
   * @param _node - The worker node.
   * @param inputs - The inputs of the worker node.
   */
  async worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    const action = inputs['input'][0];
    const type = typeof action;
    let is = false;

    if (type === 'string') {
      is = action === 'true';
    } else if (type === 'boolean') {
      is = action === true;
    } else if (type === 'number') {
      is = action === 1;
    }

    this._task.closed = is ? ['false'] : ['true'];
  }
}