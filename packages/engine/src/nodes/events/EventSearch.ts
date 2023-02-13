//@ts-nocheck
import Rete from 'rete'
import axios from 'axios'

import {
  Event,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, eventSocket, arraySocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { API_ROOT_URL } from '../../config'


const info = 'Event Search is to find simlar Events '

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

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const eventOutput = new Rete.Output('events', 'Events', anySocket)

    return node
      .addInput(dataInput)
      .addInput(embedding)
      .addOutput(dataOutput)
      .addOutput(eventOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {

    //const event = inputs['event'][0] as Event
    const embedding = (inputs['embedding'] && inputs['embedding'][0]) as string
    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'
    const params = new URLSearchParams({
        embedding: embedding,
        });
    const responseData = await axios.get(API_ROOT_URL + '/events?' + params.toString())

    return {
            events: responseData || ""
        }
    }
  
}
