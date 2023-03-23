import Rete from 'rete'

import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'
const info = `Join an array of events into a conversation formatted for prompt injection.`

type WorkerReturn = {
  conversation: string
}

export class EventsToConversation extends MagickComponent<WorkerReturn> {
  constructor() {
    // Name of the component
    super('Events to Conversation', {
      outputs: {
        conversation: 'output',
        trigger: 'option',
      },
    }, 'Event', info)
  }

  // the builder is used to "assemble" the node component.

  builder(node: MagickNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('conversation', 'Conversation', stringSocket)
    const inputList = new Rete.Input('events', 'Events', arraySocket)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(out).addInput(inputList)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: WorkerData, inputs: MagickWorkerInputs & { events: unknown[] }) {

    const events = inputs.events[0];
    let conversation = '';
    //Events.rows when the data is fetched using embedding
    if (Array.isArray(events)){
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      if(events.rows) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        events.rows.forEach((event) => {
          conversation += event.sender + ': ' + event.content + '\n';
        });
        return {
          conversation,
        }
      }
      //Events when the data is fetched using query
      if(events) events.forEach((event) => {
        conversation += event.sender + ': ' + event.content + '\n';
      });
    } else {
      // TODO: Check if Events is correct type
      type Events = { sender: string; content: string }
      conversation += (events as Events).sender + ': ' + (events as Events).content + '\n';
    }
    return {
        conversation,
    }
  }
}
