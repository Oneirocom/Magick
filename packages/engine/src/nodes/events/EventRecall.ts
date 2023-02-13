import Rete from 'rete'

import {
  Event,
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  GetEventArgs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, anySocket, eventSocket, stringSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { API_ROOT_URL } from '../../config'
const info = 'Event Recall is used to get conversation for an agent and user'

//add option to get only events from max time difference (time diff, if set to 0 or -1, will get all events, otherwise will count in minutes)
type InputReturn = {
  output: unknown
}

export class EventRecall extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Event Recall')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Events'
    this.display = true
    this.info = info
    this.runFromCache = true
  }

  builder(node: MagickNode) {
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const searchString = new Rete.Input('search', 'search', stringSocket)
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
      defaultValue: '6',
    })

    node.inspector.add(nameInput).add(type).add(max_count)

    return node
      .addInput(eventInput)
      .addInput(dataInput)
      .addInput(searchString)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent, magick }: { silent: boolean; magick: EngineContext }
  ) {
    
    const getEvents = async (params: GetEventArgs) => {
      const urlString = `${API_ROOT_URL}/events`
  
      const url = new URL(urlString)
      for (let p in params) {
        url.searchParams.append(p, params[p])
      }
  
      const response = await fetch(url.toString())
      if (response.status !== 200) return null
      const json = await response.json()
      return json.event
    }
    const event = (inputs['event'] && (inputs['event'][0] ?? inputs['event'])) as Event

    const { observer, client, channel, channelType, entities } = event

    const searchString = node?.data?.search as string

    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = node.data?.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10

    const events = await getEvents({
      type,
      search: searchString,
      observer,
      client,
      entities,
      channel,
      channelType,
      maxCount,
    })
    if (!silent) node.display(`Event ${type} found` || 'Not found')
    
    let conversation = '';

    // // for each event in events,
    // if(events) events.forEach((event) => {
    //   conversation += event.sender + ': ' + event.content + '\n';
    // });

    conversation = JSON.stringify(events);
    
    return {
      output: conversation,
    }
  }
}
