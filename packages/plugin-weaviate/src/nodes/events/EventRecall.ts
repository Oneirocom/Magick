import Rete from 'rete'

import {
  API_URL,
  Event,
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  InputControl,
  triggerSocket, anySocket, eventSocket,
  MagickComponent
} from '@magickml/engine'

const info = 'Event Recall is used to get conversation for an event and user'

//add option to get only events from max time difference (time diff, if set to 0 or -1, will get all events, otherwise will count in minutes)
type InputReturn = {
  output: unknown
}

const getEventWeaviate = async ({
  type = 'default',
  sender,
  observer,
  entities,
  client = 'system',
  channel = 'system',
  maxCount = 10,
}) => {
  const urlString = `${
    API_URL
  }/event?`

  const params = {
    type,
    sender,
    observer,
    entities,
    client,
    channel,
    maxCount,
  } as Record<string, any>
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach(key => searchParams.append(key, params[key]));
  console.log(urlString + searchParams.toString())
  const url = new URL(urlString + searchParams.toString())

  const response = await fetch(url.toString(), 
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  console.log('response is')
  console.log(response)
  if (response.status !== 200) return null
  // get the response body and parse it as JSON
  const json = await response.json()
  console.log('json is')
  console.log(json)
  return json.events;
}

export class EventRecall extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Event Recall (Vector DB)')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Vector Events'
    this.display = true
    this.info = info
    this.runFromCache = true
  }

  builder(node: MagickNode) {
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const out = new Rete.Output('output', 'Event', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
    })

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
    })

    node.inspector.add(nameInput).add(max_count).add(type)

    return node
      .addInput(eventInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
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

    let events = await getEventWeaviate({
      type,
      sender,
      observer,
      entities: [sender, observer],
      client,
      channel,
      maxCount,
    })
    if (!silent) node.display(`Event of ${type} found` || 'Not found')
    let conversation = events;
    console.log('conversation is')
    if (conversation == undefined) {
      return {
        output: "Error"
      }
    }
    
    console.log(conversation)
    
    if (conversation.error != 'Check your Args' ){
      events = events.splice(0, maxCount)
      if(events) events.forEach((event) => {
        conversation += event.properties.sender + ': ' + event.properties.content + '\n';
      });
    } else {
      conversation = "No Conversation Found"
    }

    return {
      output: conversation,
    }
  }
}