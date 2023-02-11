import Rete from 'rete'
import axios from 'axios'

import { InputControl, triggerSocket, stringSocket, eventSocket, MagickComponent } from '@magickml/engine'
import {
  Event,
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  CreateEventArgs,
  API_URL
} from "packages/engine/src/index"

const info = 'Event Store is used to store events for an event and user'

export class EventStore extends MagickComponent<Promise<void>> {
  constructor() {
    super('Event Store')

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
    const senderInput = new Rete.Input('sender', 'Sender', stringSocket)
    const agentidInput = new Rete.Input('agentid', 'Agent ID', stringSocket)
    const eventInput = new Rete.Input('event', 'Event', eventSocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(senderInput)
      .addInput(contentInput)
      .addInput(agentidInput)
      .addInput(eventInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }


  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent, magick }: { silent: boolean; magick: EngineContext }
  ) {

    const storeEventWeaviate = async ({
      type,
      observer,
      sender,
      entities,
      content,
      client,
      channel,
      agentId,
      channelType,

    }: CreateEventArgs) => {
      const response = await axios.post(
        `${
          API_URL
        }/event`,
        {
          type,
          observer,
          sender,
          entities,
          content,
          client,
          channel,
          agentId,
          channelType
        }
      )
      console.log('Created event', response.data)
      return response.data
    }

    const event = inputs['event'][0] as Event
    const sender = (inputs['sender'] && inputs['sender'][0]) as string || event.sender
    const content = (inputs['content'] && inputs['content'][0]) as string || event.content
   
   
    console.log('string content', content)
    
    let error = null;
    if (!content) {
      error = 'Content is null, not storing event'
    }
    if (!event.observer) {
      error = 'observer is null, not storing event'
    }
    if (!event.entities) {
      error = 'entities is null, not storing event'
    }

    if (error) {
      console.error(error)
      if (!silent) node.display('ERROR: ' + error)
      return
    }

    if (content && content !== '') {
      const respUser = await storeEventWeaviate({ ...event, content, sender } as any)
      if (!silent) node.display(respUser)
    } else {
      if (!silent) node.display('No input')
    }
  }
}
