/* eslint-disable no-console */
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { NodeData, MagickNode, MagickWorkerInputs, Agent } from '../../../types'
import { Task } from '../../plugins/taskPlugin/task'
import {
  arraySocket,
  stringSocket,
  triggerSocket,
  agentSocket,
} from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'

const info = `Restructure Agent Data`

type InputReturn = {
  output: {
    input: string
    speaker: string
    agent: string
    client: string
    channelId?: string
    entity: object
    roomInfo: {
      user: string
      inConversation: boolean
      isBot: boolean
      info3d: string
    }[]
  }
}

export class InputRestructureComponent extends MagickComponent<
  Promise<InputReturn>
> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super('Input Restructure')

    this.task = {
      outputs: {
        output: 'output',
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

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const input = new Rete.Input('input', 'input', stringSocket)
    const speaker = new Rete.Input('speaker', 'speaker', stringSocket)
    const agent = new Rete.Input('agent', 'agent', stringSocket)
    const client = new Rete.Input('client', 'client', stringSocket)
    const channelType = new Rete.Input(
      'channelType',
      'channelType',
      stringSocket
    )
    const channelId = new Rete.Input('channel', 'channel', stringSocket)
    const entity = new Rete.Input('entity', 'entity', stringSocket)
    const roomInfo = new Rete.Input('roomInfo', 'roomInfo', arraySocket)
    const private_key = new Rete.Input(
      'eth_private_key',
      'private_key',
      stringSocket
    )
    const public_address = new Rete.Input(
      'eth_public_address',
      'public_address',
      stringSocket
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const agentSoc = new Rete.Output('output', 'output', agentSocket)

    return node
      .addInput(speaker)
      .addInput(agent)
      .addInput(client)
      .addInput(channelId)
      .addInput(channelType)
      .addInput(entity)
      .addInput(roomInfo)
      .addInput(private_key)
      .addInput(public_address)
      .addInput(input)
      .addInput(dataInput)
      .addOutput(agentSoc)
      .addOutput(dataOutput)
  }

  // eslint-disable-next-line require-await
  async worker(_node: NodeData, inputs: MagickWorkerInputs) {
    const agent: any = {}
    Object.entries(inputs).map(([k, v]) => {
      agent[k] = v[0]
    })
    console.log('agent ::: ', agent)

    return {
      output: {
        input: agent.input,
        output: agent.output,
        speaker: agent.speaker,
        agent: agent.agent,
        client: agent.client,
        channel: agent.channel,
        channelId: agent.channelId,
        channelType: agent.channelType,
        entity: agent.entity,
        roomInfo: agent.roomInfo,
        eth_private_key: agent.eth_private_key,
        eth_public_address: agent.eth_public_address,
      },
    }
  }
}
