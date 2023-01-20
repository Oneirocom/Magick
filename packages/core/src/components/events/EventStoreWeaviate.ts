import Rete from 'rete'

import {
  Event,
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../types'
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
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
    })

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const agentidInput = new Rete.Input('agentid', 'Agent ID', stringSocket)
    const eventInput = new Rete.Input('event', 'Event', eventSocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(contentInput)
      .addInput(agentidInput)
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
    const content = (inputs['content'] && inputs['content'][0]) as string
    const agentId = (inputs['agentid'] && inputs['agentid'][0]) as string

    if (!content) return console.log('Content is null, not storing event')

    if (content && content !== '') {
      const respUser = await storeEventWeaviate({ ...event, content, agentId } as any)
      if (!silent) node.display(respUser)
    } else {
      if (!silent) node.display('No input')
    }
  }
}
