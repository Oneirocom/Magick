import Rete from 'rete'

import {
  Event,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  InputControl,
  triggerSocket,
  stringSocket,
  eventSocket,
  MagickComponent,
  API_URL
} from 'packages/engine/src/index'
import axios from 'axios'

const info = 'Event Delete is used to delete events based on inputs recevied from the user.'

const EventDel = async ({
  type = 'default',
  sender = 'system',
  observer = 'system',
  entities = [],
  client = 'system',
  channel = 'system',
  maxCount = 10,
  target_count = 'single',
  max_time_diff = -1,
}) => {
  const urlString = `${
    API_URL
  }/WeaviatePlugin`

  const params = {
    type,
    sender,
    observer,
    entities,
    client,
    channel,
    maxCount,
    target_count,
    max_time_diff,
  } as Record<string, any>
  
  const url = new URL(urlString)
  for (let p in params) {
    url.searchParams.append(p, params[p])
  }

  const response = await fetch(url.toString(), {
    method: 'DELETE',
  })
  if (response.status !== 200) return null
  const json = await response.json()
  return json.event
}

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
    const deleteEvent = async ({
      type,
      observer,
      sender,
      entities,
      content,
      client,
      channel,
    }: CreateEventArgs) => {
    const response = await axios.delete(
      `${
        API_URL
      }/WeaviatePlugin`,
      {
        type,
        observer,
        sender,
        entities,
        content,
        client,
        channel,
      }
    )
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
