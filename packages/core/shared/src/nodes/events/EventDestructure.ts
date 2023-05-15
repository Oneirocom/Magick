// DOCUMENTED
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import { NodeData } from 'rete/types/core/data'
import { MagickComponent } from '../../engine'
import { Task } from '../../plugins/taskPlugin/task'
import {
  arraySocket,
  eventSocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import {
  Event,
  MagickNode,
  MagickTask,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * Info description for EventDestructureComponent
 */
const info = `The input component allows you to pass a single value to your graph. You can set a default value to fall back to if no value is provided at runtime.  You can also turn the input on to receive data from the playtest input.`

/**
 * EventDestructureComponent
 * Class to destructure an event object
 */
export class EventDestructureComponent extends MagickComponent<Promise<Event>> {
  nodeTaskMap: Record<number, MagickTask> = {}

  /**
   * EventDestructureComponent constructor
   */
  constructor() {
    // Name of the component
    super(
      'Event Destructure',
      {
        outputs: {
          trigger: 'option',
          agentId: 'output',
          content: 'output',
          channel: 'output',
          channelType: 'output',
          connector: 'output',
          embedding: 'output',
          client: 'output',
          entities: 'output',
          observer: 'output',
          projectId: 'output',
          sender: 'output',
        },
        init: (task = {} as Task, node: NodeData) => {
          this.nodeTaskMap[node.id] = task
        },
      },
      'Event',
      info
    )
  }

  /**
   * EventDestructureComponent builder
   * @param node - MagickNode instance
   * @returns modified MagickNode instance
   */
  builder(node: MagickNode) {
    // Set a socket key if not exists
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    const out = new Rete.Output('content', 'content', stringSocket)
    const sender = new Rete.Output('sender', 'sender', stringSocket)
    const observer = new Rete.Output('observer', 'observer', stringSocket)
    const client = new Rete.Output('client', 'client', stringSocket)
    const channel = new Rete.Output('channel', 'channel', stringSocket)
    const connector = new Rete.Output('connector', 'connector', stringSocket)
    const embedding = new Rete.Output('embedding', 'embedding', arraySocket)
    const channelType = new Rete.Output(
      'channelType',
      'channelType',
      stringSocket
    )
    const rawData = new Rete.Output('rawData', 'rawData', stringSocket)
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
      .addOutput(connector)
      .addOutput(entities)
      .addOutput(projectId)
      .addOutput(observer)
      .addOutput(sender)
      .addOutput(embedding)
      .addOutput(rawData)
  }

  /**
   * EventDestructureComponent worker
   * @param _node - WorkerData instance
   * @param inputs - Object containing inputs as MagickWorkerInputs
   * @param _outputs - Object containing output as MagickWorkerOutputs
   * @returns Destructured event object
   */
  async worker(
    _node: WorkerData,
    { event }: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {
    const eventValue = event[0] ?? event

    const {
      content,
      sender,
      observer,
      client,
      channel,
      channelType,
      rawData,
      projectId,
      entities,
      embedding,
      agentId,
    } = eventValue as Event
    return {
      content,
      sender,
      observer,
      client,
      channel,
      channelType,
      rawData,
      projectId,
      entities,
      embedding,
      agentId,
      trigger: 'option',
    }
  }
}
