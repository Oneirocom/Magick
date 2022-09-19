/* eslint-disable no-console */
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  Agent,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { Task } from '../../plugins/taskPlugin/task'
import {
  agentSocket,
  arraySocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import { ThothComponent, ThothTask } from '../../thoth-component'

const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: Agent
  speaker: string
  agent: string
  client: string
  channel: string
  entity: number
  roomInfo?: {
    user: string
    inConversation: boolean
    isBot: boolean
    info3d: string
  }[]
  channel_type: string
}

export class InputDestructureComponent extends ThothComponent<
  Promise<InputReturn>
> {
  nodeTaskMap: Record<number, ThothTask> = {}

  constructor() {
    // Name of the component
    super('Input Destructure')

    this.task = {
      outputs: {
        output: 'output',
        speaker: 'output',
        agent: 'output',
        client: 'output',
        channel: 'output',
        entity: 'output',
        roomInfo: 'output',
        channel_type: 'output',
        trigger: 'option',
      },
      init: (task = {} as Task, node: ThothNode) => {
        this.nodeTaskMap[node.id] = task
      },
    }

    this.category = 'Agents'
    this.info = info
    this.display = true
  }

  builder(node: ThothNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const inp = new Rete.Input('agent', 'Agent', agentSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const out = new Rete.Output('output', 'output', stringSocket)
    const speaker = new Rete.Output('speaker', 'speaker', stringSocket)
    const agent = new Rete.Output('agent', 'agent', stringSocket)
    const client = new Rete.Output('client', 'client', stringSocket)
    const channelId = new Rete.Output('channel', 'channel', stringSocket)
    const entity = new Rete.Output('entity', 'entity', stringSocket)
    const roomInfo = new Rete.Output('roomInfo', 'roomInfo', arraySocket)
    const channel_type = new Rete.Output(
      'channel_type',
      'channel_type',
      stringSocket
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(speaker)
      .addOutput(agent)
      .addOutput(client)
      .addOutput(channelId)
      .addOutput(entity)
      .addOutput(roomInfo)
      .addOutput(channel_type)
      .addOutput(out)
      .addOutput(dataOutput)
  }

  // eslint-disable-next-line require-await
  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    // eslint-disable-next-line prettier/prettier
    const agent = inputs.agent != null ? inputs.agent[0] : inputs

    //console.log('destructuring ', inputs)

    if (!silent) node.display(agent)
    // If there are outputs, we are running as a module input and we use that value
    return {
      output: (agent as any).Input ?? agent,
      speaker: (agent as any)['Speaker'] ?? 'Speaker',
      agent: (agent as any)['Agent'] ?? 'Agent',
      client: (agent as any)['Client'] ?? 'Playtest',
      channel: (agent as any)['ChannelID'] ?? 'TestChannel',
      entity: (agent as any)['Entity'],
      roomInfo: (agent as any)['RoomInfo'],
      channel_type: (agent as any)['Channel'],
    }
  }
}
