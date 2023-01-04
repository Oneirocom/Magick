/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
// require('isomorphic-fetch');
import Rete from 'rete'

import {
  Agent,
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, anySocket, agentSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Event Recall is used to get conversation for an agent and user'

//add option to get only events from max time difference (time diff, if set to 0 or -1, will get all events, otherwise will count in minutes)
type InputReturn = {
  output: unknown
}

export class EventRecall extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Event Recall')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
    this.runFromCache = true
  }

  builder(node: ThothNode) {
    const agentInput = new Rete.Input('agent', 'Agent', agentSocket)
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
      .addInput(agentInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { getEvent } = thoth

    const agentObj = inputs['agent'] && (inputs['agent'][0] as Agent)

    const { speaker, client, channel, agent } = agentObj

    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const maxCountData = node.data?.max_count as string
    const maxCount = maxCountData ? parseInt(maxCountData) : 10
    const max_time_diffData = node.data?.max_time_diff as string
    const max_time_diff = max_time_diffData ? parseInt(max_time_diffData) : -1

    const event = await getEvent({
      type,
      agent,
      speaker,
      client,
      channel,
      maxCount,
      max_time_diff,
    })
    if (!silent) node.display(`Event ${type} found` || 'Not found')

    return {
      output: event ?? '',
    }
  }
}
