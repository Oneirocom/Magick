// DOCUMENTED
import Rete from '@magickml/rete'
import { InputControl } from '../../dataControls/InputControl'
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
  GetEventArgs,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'

const info =
  'Searches for events in the Events store based on the Type property and returns an array of events limited by the Max Count property. The optional Embedding input will search for events based on the similarity of their stored embeddings. '

/**
 * Type definition for the input events.
 */
type InputReturn = {
  events: unknown[]
}

enum FilterTypes {
  ChannelAndSender = 'Channel And Sender (DMs OK)',
  AllInChannel = 'All In Channel',
  AllFromSender = 'All From Sender (No DMs)',
  AllFromConnector = 'All From Connector',
  All = 'All',
}

enum RecallModes {
  MostRecent = 'Most Recent',
  MostRevelant = 'Most Relevant (Use Embedding)',
}

/**
 * EventRecall class, retrieves conversation events.
 */
export class EventRecall extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super(
      'Event Recall',
      {
        outputs: {
          events: 'output',
          trigger: 'option',
        },
      },
      'Storage/Events',
      info
    )

    this.common = true
  }

  /**
   * Builds the node with inputs and outputs.
   * @param node - The MagickNode to build.
   * @returns MagickNode - The built node, which is a Rete node wrapped with additional Magick data.
   */
  builder(node: MagickNode): MagickNode {
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const out = new Rete.Output('events', 'Events', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const typeSocket = new Rete.Input('type', 'Type', stringSocket)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Name',
      placeholder: 'Event Recall',
      tooltip: 'Event input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'conversation',
      tooltip: 'Event input type',
    })

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
      defaultValue: '6',
      tooltip: 'Event max count value',
    })

    // FilterTypes is an enum, so we can use Object.values to get the values
    const filterTypes = Object.values(FilterTypes)
    const recallModes = Object.values(RecallModes)

    const mode = new DropdownControl({
      name: 'Mode',
      dataKey: 'mode',
      values: recallModes,
      defaultValue: recallModes[0],
      tooltip: 'Choose Event Mode name',
    })

    const filterBy = new DropdownControl({
      name: 'Filter By',
      dataKey: 'filterBy',
      values: filterTypes,
      defaultValue: filterTypes[0],
      tooltip: 'Filter Event type name',
    })

    const lastMode = node.data.mode

    if (node.data.mode === RecallModes.MostRevelant || !node.data.mode) {
      node.addInput(new Rete.Input('embedding', 'Embedding', embeddingSocket))
    }

    // based on mode data we can show/hide the embedding input
    mode.onData = value => {
      if (value === RecallModes.MostRevelant) {
        if (lastMode === RecallModes.MostRevelant) {
          return
        }
        // if the input is not already added, add it
        if (!node.inputs.has('embedding')) {
          node.addInput(
            new Rete.Input('embedding', 'Embedding', embeddingSocket)
          )
        }
      } else {
        // if the input is already added, remove it
        if (node.inputs.has('embedding')) {
          node.inputs.delete('embedding')
        }
      }
    }

    node.inspector
      .add(nameInput)
      .add(type)
      .add(max_count)
      .add(filterBy)
      .add(mode)

    return node
      .addInput(dataInput)
      .addInput(eventInput)
      .addOutput(dataOutput)
      .addOutput(out)
      .addInput(typeSocket)
  }

  /**
   * Worker function that gets the events based on the inputs.
   * @param node - The WorkerData (Node data).
   * @param inputs - The MagickWorkerInputs (Worker inputs).
   * @param _outputs - The MagickWorkerOutputs (Worker outputs).
   * @returns Promise<InputReturn> - Promise containing the InputReturn.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ) {
    const { app } = context.module
    if (!app) throw new Error('App is not defined, cannot create event')

    const getEvents = async (params: GetEventArgs) => {
      const result = await app.service('events').find({ query: params })
      const { events } = result

      return events
    }
    const typeSocket = (inputs['type'] && inputs['type'][0]) as string

    const event = (inputs['event'] &&
      (inputs['event'][0] || inputs['event'])) as Event
    let embedding = (inputs['embedding'] ? inputs['embedding'][0] : null) as
      | number[]
      | string
      | string[]

    if (typeof embedding == 'string') {
      embedding = (embedding as string).replace('[', '').replace(']', '')
      embedding = (embedding as string)?.split(',')
    }

    const { client, channel, connector, channelType, projectId, entities } =
      event

    const typeData = node?.data?.type as string
    const typeRaw =
      typeSocket ??
      (typeData !== undefined && typeData.length > 0 ? typeData : 'none')
    const type = typeRaw.trim()

    let max_count
    if (typeof node.data.max_count === 'string') {
      max_count = parseInt(node.data.max_count)
    } else if (typeof node.data.max_count === 'number') {
      max_count = node.data.max_count
    } else {
      max_count = 10
    }
    const data = {
      type,
      client,
      entities,
      channel,
      connector,
      channelType,
      projectId,
      $limit: max_count ?? 1,
    }

    const filterBy = node.data.filterBy
    if (filterBy === FilterTypes.ChannelAndSender) {
      // no need to do anything, should just work
    } else if (filterBy === FilterTypes.AllInChannel) {
      // filter by observer but not sender
      delete data['entities']
    } else if (filterBy === FilterTypes.AllFromSender) {
      // filter by sender but not channel
      delete data['channel']
      delete data['channelType']
    } else if (filterBy === FilterTypes.AllFromConnector) {
      // filter by connector but not channel or sender
      delete data['channel']
      delete data['channelType']
      delete data['entities']
    } else if (filterBy === FilterTypes.All) {
      // filter by all except sender, channel, and connector -- basically all for this observer
      delete data['channel']
      delete data['entities']
      delete data['connector']
      delete data['channelType']
    }

    if (embedding) {
      data['embedding'] = embedding
    }

    if (embedding) {
      if (embedding.length === 1536) {
        const enc_embed = new Float32Array(embedding as Iterable<number>)
        const uint = new Uint8Array(enc_embed.buffer)
        const str = btoa(
          String.fromCharCode.apply(
            null,
            Array.from<number>(new Uint8Array(uint))
          )
        )
        data['embedding'] = str
      }
    }

    const events = await getEvents(data)
    return {
      events,
    }
  }
}
