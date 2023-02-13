import Rete from 'rete'
import axios from 'axios'

import {
  Event,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  CreateEventArgs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, eventSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { API_ROOT_URL } from '../../config'

const info = 'Event Store is used to store events for an event and user'

export class EventStore extends MagickComponent<Promise<void>> {
  constructor() {
    super('Store Event')

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

    const makeSearchable = new BooleanControl({
      dataKey: 'makeSearchable',
      name: 'Make Searchable',
      icon: 'moon',
    })

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const eventInput = new Rete.Input('event', 'Event', eventSocket)

    node.inspector.add(nameInput).add(type).add(makeSearchable)

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
    { silent }: { silent: boolean }
  ) {

    const storeEvent = async (eventData: CreateEventArgs) => {
      const response = await axios.post(
        `${API_ROOT_URL}/event`, eventData
      )
      console.log('Created event', response.data)
      return response.data
    }

    const event = inputs['event'][0] as Event
    const content = (inputs['content'] && inputs['content'][0]) as string

    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const makeSearchable = node?.data?.makeSearchable

    if (!content) return console.log('Content is null, not storing event')

    if (content && content !== '') {
      const respUser = await storeEvent({ ...event, content, type, makeSearchable } as any)
      if (!silent) node.display(respUser)
    } else {
      if (!silent) node.display('No input')
    }
  }
}
