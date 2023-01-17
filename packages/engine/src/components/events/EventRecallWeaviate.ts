import Rete from 'rete'

import {
  Event,
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, anySocket, eventSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Event Recall is used to get conversation for an event and user'

//add option to get only events from max time difference (time diff, if set to 0 or -1, will get all events, otherwise will count in minutes)
type InputReturn = {
  output: unknown
}

export class EventRecallWeaviate extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Event Recall Weaviate')

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

    const max_time_diff = new InputControl({
      dataKey: 'max_time_diff',
      name: 'Max Time Difference',
      icon: 'moon',
    })

    node.inspector.add(nameInput).add(max_count).add(type).add(max_time_diff)

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
    const max_time_diffData = node.data?.max_time_diff as string
    const max_time_diff = max_time_diffData ? parseInt(max_time_diffData) : -1

    const getEventWeaviate = async ({
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
        import.meta.env.VITE_APP_API_URL ??
        import.meta.env.API_ROOT_URL
      }/eventWeaviate`
  
      const params = {
        type,
        observer,
        sender,
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
  
      const response = await fetch(url.toString())
      console.log(response)
      if (response.status !== 200) return null
      const json = await response.json()
      return json.event
    }

    const event_wes = await getEventWeaviate({
      type,
      sender,
      observer,
      client,
      channel,
      maxCount,
      max_time_diff,
    })
    if (!silent) node.display(`Event ${type} found` || 'Not found')
    
    return {
      output: event_wes ?? '',
    }
  }
}
