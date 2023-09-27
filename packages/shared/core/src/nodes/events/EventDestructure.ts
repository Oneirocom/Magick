// DOCUMENTED
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'

import { MagickComponent } from '../../engine'
import {
  arraySocket,
  embeddingSocket,
  eventSocket,
  stringSocket,
  triggerSocket,
} from '../../sockets'
import {
  Event,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * Info description for EventDestructureComponent
 */
const info = `Takes an event input and splits it up into its individual components that you can access through the outputs.
`

/**
 * EventDestructureComponent
 * Class to destructure an event object
 */
export class EventDestructureComponent extends MagickComponent<Promise<Event>> {
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
      },
      'Storage/Events',
      info
    )

    this.common = true
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
    const embedding = new Rete.Output('embedding', 'embedding', embeddingSocket)
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
      connector,
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
      connector,
      agentId,
      trigger: 'option',
    }
  }
}
