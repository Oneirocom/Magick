import Rete from 'rete'

import {
  Event,
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../core/types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, eventSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Event Store is used to store events for an event and user'

export class EventStoreWeaviate extends MagickComponent<Promise<void>> {
  constructor() {
    super('Store Event Weaviate')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Events'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const eventInput = new Rete.Input('event', 'Event', eventSocket)
    const factsInp = new Rete.Input('primary', 'Primary Event', stringSocket)

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
    })

    node.inspector.add(nameInput).add(type)

    const factaInp = new Rete.Input(
      'secondary',
      'Secondary Event (Opt)',
      stringSocket
    )

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(factsInp)
      .addInput(factaInp)
      .addInput(eventInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent, magick }: { silent: boolean; magick: EngineContext }
  ) {
    const { storeEventWeaviate } = magick
    const event = inputs['event'][0] as Event
    const primary = ((inputs['primary'] && inputs['primary'][0]) ||
      inputs['primary']) as string
    const secondary = ((inputs['secondary'] && inputs['secondary'][0]) ||
      inputs['secondary']) as string

    if (!primary) return console.log('Event null, so skipping')

    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    let respUser
    let respevent

    const { observer, sender, client, channel } = event

    if (primary) {
      respUser = await storeEventWeaviate({
        type,
        observer,
        sender,
        entities: [observer as string, sender as string],
        content: primary,
        client,
        channel,
      })
    }

    if (secondary) {
      respevent = await storeEventWeaviate({
        type,
        observer,
        sender: observer,
        entities: [observer as string, sender as string],
        content: secondary,
        client,
        channel,
      })
    }
    console.log(respUser)
    console.log(respevent)
    if (!silent) node.display(respUser + '|' + respevent)

    // If we are on the client, we want to refresh the event table UI
    // if (this?.editor?.refreshEventTable) this.editor.refreshEventTable()
  }
}
