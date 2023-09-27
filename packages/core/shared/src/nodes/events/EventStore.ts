// DOCUMENTED
import Rete from 'shared/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import {
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
  ModuleContext,
  WorkerData,
} from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'

enum StoreEventForTypes {
  Sender = 'Sender (User)',
  Observer = 'Observer (Agent)',
}
/**
 * Information about the EventStore class
 */
const info =
  'Takes an input event and stores it in the Events store with the type specified in the Type property. The content, sender override, and embedding inputs allow you to store/override additional information about the event.'

/**
 * EventStore class that extends MagickComponent
 */
export class EventStore extends MagickComponent<Promise<void>> {
  constructor() {
    super(
      'Store Event',
      { outputs: { trigger: 'option' } },
      'Storage/Events',
      info
    )

    this.common = true
  }

  /**
   * Builder function to configure the node for event storage
   * @param node
   */
  builder(node: MagickNode) {
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Name',
      placeholder: 'Store Event',
      tooltip: 'Store Event input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'conversation',
      tooltip: 'Store Event input type',
    })

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const embedding = new Rete.Input('embedding', 'Embedding', embeddingSocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const typeSocket = new Rete.Input('type', 'Type', stringSocket)

    const storeEventForTypes = Object.values(StoreEventForTypes)
    const storeEventFor = new DropdownControl({
      name: 'Store Event For',
      dataKey: 'storeEventFor',
      values: storeEventForTypes,
      defaultValue: storeEventForTypes[0],
      tooltip: 'Choose Store Event For',
    })

    node.inspector.add(storeEventFor)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addInput(eventInput)
      .addInput(embedding)
      .addInput(typeSocket)
      .addOutput(dataOutput)
  }

  /**
   * Worker function to process and store the event
   * @param node
   * @param inputs
   * @param _outputs
   * @param context
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ) {
    const { projectId } = context

    const event = inputs['event'][0] as Event
    const typeSocket = inputs['type'] && (inputs['type'][0] as string)
    let content = (inputs['content'] ? inputs['content'][0] : null) as string
    let embedding = (
      inputs['embedding'] ? inputs['embedding'][0] : undefined
    ) as number[]

    if (typeof embedding == 'string') {
      embedding = (embedding as string).split(',').map(x => parseFloat(x))
    }

    const typeData = node?.data?.type as string

    const type =
      typeSocket ??
      ((typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none') as string)

    if (!content) {
      content = (event as Event).content || 'Error'
      if (!content) throw new Error('Content is null, not storing the event !!')
    }

    type Data = {
      sender: string
      observer: string
      projectId: string
      content: string
      type: string
      date: string
      embedding?: number[] | string[]
    }

    const eventValues = [
      'id',
      'type',
      'content',
      'sender',
      'entities',
      'observer',
      'client',
      'channel',
      'channelType',
      'connector',
      'projectId',
      'agentId',
      'embedding',
      'date',
      'rawData',
    ]

    const data: Data = {
      ...event,
      observer: event.observer as string,
      sender: event.sender as string,
      projectId,
      content,
      type,
      date: new Date().toISOString(),
    }

    // delete any values that are not in the eventValues array
    Object.keys(data).forEach(key => {
      if (!eventValues.includes(key)) {
        delete data[key]
      }
    })

    if (embedding) data.embedding = embedding
    else delete data.embedding

    const storeEventFor = node?.data?.storeEventFor as string
    if (storeEventFor === StoreEventForTypes.Observer) {
      data.sender = data.observer
    } else if (storeEventFor === StoreEventForTypes.Sender) {
      // do nothing
    }

    if (content && content !== '') {
      const { app } = context.module
      if (!app) throw new Error('App is not defined, cannot create event')
      await app.service('events').create(data)
    } else {
      throw new Error('Content is empty, not storing the event !!')
    }
  }
}
