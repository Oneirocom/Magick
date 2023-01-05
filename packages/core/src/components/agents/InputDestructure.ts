/* eslint-disable camelcase */
/* eslint-disable no-console */
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  Agent,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
import { Task } from '../../plugins/taskPlugin/task'
import {
  agentSocket,
  arraySocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'

const info = `The input component allows you to pass a single value to your graph.  You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

type InputReturn = {
  output: Agent | unknown
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
  eth_private_key: string
  eth_public_address: string
  channel_type?: string
}

export class InputDestructureComponent extends ThothComponent<
  Promise<InputReturn>
> {
  nodeTaskMap: Record<number, MagickTask> = {}

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
        eth_private_key: 'output',
        eth_public_address: 'output',
        roomInfo: 'output',
        channelType: 'output',
        trigger: 'option',
      },
      init: (task = {} as Task, node: MagickNode) => {
        this.nodeTaskMap[node.id] = task
      },
    }

    this.category = 'Agents'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const inp = new Rete.Input('agent', 'Agent', agentSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const out = new Rete.Output('output', 'output', stringSocket)
    const speaker = new Rete.Output('speaker', 'speaker', stringSocket)
    const agent = new Rete.Output('agent', 'agent', stringSocket)
    const client = new Rete.Output('client', 'client', stringSocket)
    const channel = new Rete.Output('channel', 'channel', stringSocket)
    const channelId = new Rete.Output('channelId', 'channelId', stringSocket)
    const entity = new Rete.Output('entity', 'entity', stringSocket)
    const private_key = new Rete.Output(
      'eth_private_key',
      'private_key',
      stringSocket
    )
    const public_address = new Rete.Output(
      'eth_public_address',
      'public_address',
      stringSocket
    )
    const roomInfo = new Rete.Output('roomInfo', 'roomInfo', arraySocket)
    // eslint-disable-next-line camelcase
    const channelType = new Rete.Output(
      'channelType',
      'channelType',
      stringSocket
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(speaker)
      .addOutput(agent)
      .addOutput(client)
      .addOutput(channel)
      .addOutput(channelId)
      .addOutput(entity)
      .addOutput(roomInfo)
      .addOutput(channelType)
      .addOutput(private_key)
      .addOutput(public_address)
      .addOutput(out)
      .addOutput(dataOutput)
  }

  // eslint-disable-next-line require-await
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    // eslint-disable-next-line prettier/prettier
    const agent = inputs.agent != null ? inputs.agent[0] : inputs

    //console.log('destructuring ', inputs)

    if (!silent) node.display(agent)
    // If there are outputs, we are running as a module input and we use that value

    return {
      output: typeof agent === 'string' ? agent : (agent as any).input,
      speaker: (agent as any)['speaker'] ?? 'Speaker',
      agent: (agent as any)['agent'] ?? 'Agent',
      client: (agent as any)['client'] ?? 'Playtest',
      channel: (agent as any)['channel'] ?? 'TestChannel',
      channelId: (agent as any)['channelId'] ?? 'TestChannelId',
      entity: (agent as any)['entity'],
      roomInfo: (agent as any)['roomInfo'],
      eth_private_key: (agent as any)['eth_private_key'],
      eth_public_address: (agent as any)['eth_public_address'],
      channelType: (agent as any)['channelType'],
    }
  }
}
