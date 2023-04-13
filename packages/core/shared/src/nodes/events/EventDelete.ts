// DOCUMENTED 
import Rete from 'rete';
import axios from 'axios';
import { API_ROOT_URL } from '../../config';
import { MagickComponent } from '../../engine';
import { arraySocket, objectSocket, triggerSocket } from '../../sockets';
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types';
import _ from 'lodash';

const info = 'Join an array of events into a conversation formatted for prompt injection.';

/**
 * A Rete component representing an event deletion node in the visual programming editor.
 */
export class EventDelete extends MagickComponent<Promise<void>> {
  constructor() {
    super('Event Delete', {
      outputs: {
        conversation: 'output',
        trigger: 'option',
      },
    }, 'Event', info);
  }

  /**
   * Assembles the node component in the visual programming editor.
   * @param node - The node to add inputs and outputs to.
   * @returns The assembled node with inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
    const inputList = new Rete.Input('event', 'Event', objectSocket);

    return node.addInput(inputList).addInput(dataInput).addOutput(dataOutput);
  }

  /**
   * Executes the event deletion logic.
   *
   * @param node - Node data from the visual programming editor.
   * @param inputs - Node input values from connected inputs in the editor.
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs, outputs: any, context: any) {
    try {
      const event = inputs.event[0] as { id: number }

      const { app } = context.module;
      if(!app) throw new Error('App is not defined, cannot delete event');
      app.service('events').remove(event.id);
    } catch (e) {
      throw new Error(`Error deleting event: ${e}`);
    }
  }
}