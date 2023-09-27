// DOCUMENTED
import Rete from 'shared/rete'

import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

// Information about the component
const info =
  'Join an array of events input into an output string conversation formatted for prompt injection.'

type WorkerReturn = {
  conversation: string
}

/**
 * EventsToConversation component, responsible for converting an array of events into a conversation string.
 */
export class EventsToConversation extends MagickComponent<WorkerReturn> {
  constructor() {
    // Name of the component and its output sockets definition
    super(
      'Events to Conversation',
      {
        outputs: {
          conversation: 'output',
          trigger: 'option',
        },
      },
      'Storage/Events',
      info
    )

    this.displayName = 'Events to String'

    this.common = true
  }

  /**
   * Builds the node component, adding necessary inputs and outputs.
   * @param node - The MagickNode to be built.
   * @returns The built node with the appropriate inputs and outputs.
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('conversation', 'Conversation', stringSocket)
    const inputList = new Rete.Input('events', 'Events', arraySocket)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addInput(inputList)
  }

  /**
   * Worker method that performs the main logic of the component, converting events to conversation string.
   * @param node - The worker data for the current node.
   * @param inputs - The current inputs of the node.
   * @returns An object containing the resulting conversation string.
   */
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs & { events: unknown[] }
  ): WorkerReturn {
    const events = inputs.events[0]
    let conversation = ''

    if (Array.isArray(events)) {
      // @ts-ignore
      if (events.rows) {
        // @ts-ignore
        events.rows.forEach((event: { sender: string; content: string }) => {
          conversation += event.sender + ': ' + event.content + '\n'
        })
        return {
          conversation,
        }
      }

      if (events) {
        events.forEach((event: { sender: string; content: string }) => {
          conversation += event.sender + ': ' + event.content + '\n'
        })
      }
    } else {
      type Events = { sender: string; content: string }
      conversation +=
        (events as Events).sender + ': ' + (events as Events).content + '\n'
    }

    return {
      conversation,
    }
  }
}
