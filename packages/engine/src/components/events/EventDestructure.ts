import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  Event,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../core/types'
import { Task } from '../../plugins/taskPlugin/task'
import {
  eventSocket,
  arraySocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import { MagickComponent, MagickTask } from '../../magick-component'

const info = `The input component allows you to pass a single value to your graph. You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

export class EventDestructureComponent extends MagickComponent<Promise<Event>> {
  nodeTaskMap: Record<number, MagickTask> = {}

  constructor() {
    // Name of the component
    super('Input Destructure')

    this.task = {
      outputs: {
        content: 'output',
        sender: 'output',
        observer: 'output',
        entities: 'output',
        client: 'output',
        channel: 'output',
        channelType: 'output',
        agentId: 'output',
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

    const out = new Rete.Output('content', 'content', stringSocket)
    const sender = new Rete.Output('sender', 'sender', stringSocket)
    const observer = new Rete.Output('observer', 'observer', stringSocket)
    const client = new Rete.Output('client', 'client', stringSocket)
    const channel = new Rete.Output('channel', 'channel', stringSocket)
    const channelType = new Rete.Output('channelType', 'channelType', stringSocket)
    const agentId = new Rete.Output('agentId', 'agentId', stringSocket)
    const entities = new Rete.Output('entities', 'entities', arraySocket)

    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(eventInput)
      .addOutput(sender)
      .addOutput(observer)
      .addOutput(client)
      .addOutput(channel)
      .addOutput(agentId)
      .addOutput(entities)
      .addOutput(channelType)
      .addOutput(out)
      .addOutput(dataOutput)
  }

  // eslint-disable-next-line require-await
  async worker(
    node: NodeData,
    {event}: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const { content, sender, observer, client, channel, channelType, entities, agentId} = event && (event[0] ?? event) as Event
    
    if (!silent) node.display(event)

    return {
      content,
      sender,
      observer,
      client,
      channel,
      channelType,
      entities,
      agentId,
      trigger: 'option',
    }
  }
}
