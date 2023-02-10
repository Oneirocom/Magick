//@ts-nocheck
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
  const json = await response
  return json
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
    const out = new Rete.Output('output', 'Output', stringSocket)
    return node
      .addInput(contentInput)
      .addInput(eventInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const eventObj = inputs['event'] && (inputs['event'][0] as Event)

    const { observer, client, channel, sender } = eventObj

    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = node.data?.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10
    const max_time_diffData = node.data?.max_time_diff as string
    const max_time_diff = max_time_diffData ? parseInt(max_time_diffData) : -1

/*     const events = await EventDel({
      type,
      sender,
      observer,
      client,
      channel,
      maxCount,
      max_time_diff,
    })

    let number_of_events = events; */
    return {
      output: "number_of_events" ?? '',
    }
  }
}
