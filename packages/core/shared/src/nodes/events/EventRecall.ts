// DOCUMENTED
import Rete from 'rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, eventSocket, triggerSocket } from '../../sockets'
import {
  Event,
  GetEventArgs,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'

const info = 'Event Recall is used to get conversation for an agent and user'

/**
 * Type definition for the input events.
 */
type InputReturn = {
  events: unknown[]
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
      'Event',
      info
    )

    this.runFromCache = true
  }

  /**
   * Builds the node with inputs and outputs.
   * @param node - The MagickNode to build.
   * @returns MagickNode - The built node, which is a Rete node wrapped with additional Magick data.
   */
  builder(node: MagickNode): MagickNode {
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)
    const out = new Rete.Output('events', 'Events', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
      placeholder: 'Conversation',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'conversation',
    })

    const max_count = new InputControl({
      dataKey: 'max_count',
      name: 'Max Count',
      icon: 'moon',
      defaultValue: '6',
    })

    node.inspector.add(nameInput).add(type).add(max_count)

    return node
      .addInput(dataInput)
      .addInput(eventInput)
      .addInput(embedding)
      .addOutput(dataOutput)
      .addOutput(out)
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

    const {
      observer,
      client,
      channel,
      connector,
      channelType,
      projectId,
      entities,
    } = event

    const typeData = (node.data as { type: string })?.type
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'
    const maxCountData =
      (node?.data?.max_count as string) &&
      (node?.data as { max_count: string })?.max_count
    const limit = maxCountData ? parseInt(maxCountData) : 10
    const data = {
      type,
      observer,
      client,
      entities,
      channel,
      connector,
      channelType,
      projectId,
      $limit: limit,
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
