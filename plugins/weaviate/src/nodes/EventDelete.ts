import Rete from 'rete'

import {
  Event,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../../packages/engine/src/types'
import { InputControl } from '../../../../packages/engine/src/dataControls/InputControl'
import { triggerSocket, stringSocket, eventSocket } from '../../../../packages/engine/src/sockets'
import { MagickComponent } from '../../../../packages/engine/src/magick-component'

const info = 'Event Delete is used to delete events based on inputs recevied from the user.'

export class EventDelete extends MagickComponent<Promise<void>> {
  constructor() {
    super('EventDelete')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Events'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
    })

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const eventInput = new Rete.Input('event', 'Event', eventSocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(contentInput)
      .addInput(eventInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const deleteEvent = async (event: Event) => {
      const resp = null; // await weaviate.events.delete(event)
      return resp
    }
    const event = inputs['event'][0] as Event
    const content = (inputs['content'] && inputs['content'][0]) as string

    if (!content) return console.log('Content is null, not deleting event')

    if (content && content !== '') {
      const respUser = await deleteEvent({ ...event, content } as any)
    }
  }
}
