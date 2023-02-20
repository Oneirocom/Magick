/* eslint-disable no-console */
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { NodeData, MagickNode, MagickWorkerInputs, Event } from '../../types'
import { Task } from '../../plugins/taskPlugin/task'
import {
  arraySocket,
  stringSocket,
  triggerSocket,
  eventSocket,
  numSocket,
} from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'

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
      init: (task = {} as Task, node: MagickNode) => {
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
    const channelType = new Rete.Input('channelType', 'channelType', stringSocket)
    const projectId = new Rete.Input('projectId', 'projectId', stringSocket)
    const entity = new Rete.Input('entity', 'entity', stringSocket)
    const entities = new Rete.Input('entities', 'entities', arraySocket)
    const agentId = new Rete.Input('agentId','agentId', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const event = new Rete.Output('output', 'output', eventSocket)

    return node
      .addInput(sender)
      .addInput(observer)
      .addInput(client)
      .addInput(channelType)
      .addInput(projectId)
      .addInput(entity)
      .addInput(entities)
      .addInput(content)
      .addInput(agentId)
      .addInput(dataInput)
      .addOutput(event)
      .addOutput(dataOutput)
  }

  async worker(_node: NodeData, inputs: MagickWorkerInputs) {
    const output: any = {}
    Object.entries(inputs).map(([k, v]) => {
      if (k==="agentId") {
        output[k] = parseInt(v[0] as string)
      } else {
        output[k] = v[0]
      }
      
    })
    console.log('event ::: ', output)

    return {
      output
    }
  }
}
