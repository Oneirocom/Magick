// DOCUMENTED 
import Rete from 'rete';
import axios from 'axios';
import { API_ROOT_URL } from '../../config';
import { MagickComponent } from '../../engine';
import { arraySocket, triggerSocket } from '../../sockets';
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
    const inputList = new Rete.Input('events', 'Events', arraySocket);

    return node.addInput(inputList).addInput(dataInput).addOutput(dataOutput);
  }

  /**
   * Executes the event deletion logic.
   *
   * @param node - Node data from the visual programming editor.
   * @param inputs - Node input values from connected inputs in the editor.
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs & { events: unknown[] }) {
    try {
      const events = inputs.events[0];
      
      if (Array.isArray(events)) {
        // Events.rows when the data is fetched using embedding.
        // @ts-ignore
        if (events.rows) {
          // @ts-ignore
          events.rows.forEach(async (event) => {
            await axios.delete(`${API_ROOT_URL}/events/${event.id}`);
          });
        }

        // Events when the data is fetched using query.
        if (events) events.forEach(async (event) => {
          await axios.delete(`${API_ROOT_URL}/events/${event.id}`);
        });
      } else {
        const id: string | null = _.get(events, 'id', null);
        if (id === null) throw new Error('Event ID not found');
        await axios.delete(`${API_ROOT_URL}/events/${id}`);
      }
    } catch (e) {
      console.log('Error: ', e);
    }
  }
}