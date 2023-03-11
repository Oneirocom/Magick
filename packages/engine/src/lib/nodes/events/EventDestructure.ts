import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  Event,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
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
    super('Event Destructure')

    this.task = {
      outputs: {
        trigger: 'option',
        agentId: 'output',
        content: 'output',
        channel: 'output',
        channelType: 'output',
        client: 'output',
        entities: 'output',
        observer: 'output',
        projectId: 'output',
        sender: 'output',
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
    const channelType = new Rete.Output(
      'channelType',
      'channelType',
      stringSocket
    )
    const projectId = new Rete.Output('projectId', 'projectId', stringSocket)
    const agentId = new Rete.Output('agentId', 'agentId', stringSocket)
    const entities = new Rete.Output('entities', 'entities', arraySocket)

    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(eventInput)
      .addOutput(dataOutput)
      .addOutput(agentId)
      .addOutput(out)
      .addOutput(client)
      .addOutput(channel)
      .addOutput(channelType)
      .addOutput(entities)
      .addOutput(projectId)
      .addOutput(observer)
      .addOutput(sender)
  }

  // eslint-disable-next-line require-await
  async worker(
    node: NodeData,
    { event }: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent }: { silent: boolean }
  ) {
    const eventValue = event[0] ?? event

    const {
      content,
      sender,
      observer,
      client,
      channel,
      channelType,
      projectId,
      entities,
      agentId,
    } = eventValue as Event

    if (!silent) node.display(event)
    console.log('sender, ', sender)
    return {
      content,
      sender,
      observer,
      client,
      channel,
      channelType,
      projectId,
      entities,
      agentId,
      trigger: 'option',
    }
  }
}
