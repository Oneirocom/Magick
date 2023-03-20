/* eslint-disable no-console */
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { MagickNode, MagickWorkerInputs, Event, WorkerData } from '../../types'
import { Task } from '../../plugins/taskPlugin/task'
import {
  arraySocket,
  stringSocket,
  triggerSocket,
  eventSocket,
  numSocket,
} from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'
import { NodeData } from 'rete/types/core/data'

const info = `Restructure Event Data`

export class EventRestructureComponent extends MagickComponent<
  Promise<{ output: Event }>
> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super('Event Restructure')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
      init: (task = {} as Task, node: NodeData) => {
        this.nodeTaskMap[node.id] = task
      },
    }

    this.category = 'Events'
    this.info = info
    this.display = true
  }

  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const content = new Rete.Input('content', 'content', stringSocket)
    const sender = new Rete.Input('sender', 'sender', stringSocket)
    const observer = new Rete.Input('observer', 'observer', stringSocket)
    const client = new Rete.Input('client', 'client', stringSocket)
    const channelType = new Rete.Input(
      'channelType',
      'channelType',
      stringSocket
    )
    const projectId = new Rete.Input('projectId', 'projectId', stringSocket)
    const channel = new Rete.Input('channel', 'channel', stringSocket)
    const entities = new Rete.Input('entities', 'entities', arraySocket)
    const agentId = new Rete.Input('agentId', 'agentId', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const event = new Rete.Output('output', 'output', eventSocket)

    return node

      .addInput(dataInput)
      .addInput(content)
      .addInput(agentId)
      .addInput(channel)
      .addInput(channelType)
      .addInput(client)
      .addInput(entities)
      .addInput(observer)
      .addInput(projectId)
      .addInput(sender)
      .addOutput(dataOutput)
      .addOutput(event)
  }

  async worker(_node: WorkerData, inputs: MagickWorkerInputs) {
    const output: Record<string, unknown> = {}
    Object.entries(inputs).forEach(([k, v]) => {
      if (k === 'agentId') {
        output[k] = parseInt(v[0] as string)
      } else {
        output[k] = v[0]
      }
    })
    console.log('event ::: ', output)

    return {
      output,
    }
  }
}
