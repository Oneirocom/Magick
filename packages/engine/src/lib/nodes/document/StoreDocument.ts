import Rete from 'rete'
import axios from 'axios'

import {
  Document,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import {
  triggerSocket,
  stringSocket,
  arraySocket,
} from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { API_ROOT_URL } from '../../config'

const info = 'Store documents'

export class StoreDocument extends MagickComponent<Promise<void>> {
  constructor() {
    super('Store Document', {
      outputs: {
        trigger: 'option',
      },
    }, 'Document', info)

    this.display = true
  }

  builder(node: MagickNode) {
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

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)
    const owner = new Rete.Input('owner', 'Owner', stringSocket)
    const date = new Rete.Input('date', 'Date', stringSocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addInput(owner)
      .addInput(date)
      .addInput(embedding)
      .addOutput(dataOutput)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context
  ) {
    const { projectId } = context

    const document = inputs['document'][0] as Document
    const owner = (inputs['owner'] ? inputs['owner'][0] : null) as string
    const content = (inputs['content'] ? inputs['content'][0] : null) as string
    let embedding = (
      inputs['embedding'] ? inputs['embedding'][0] : null
    ) as number[]
    if (typeof embedding == 'string') embedding = (embedding as any).split(',')
    const typeData = node?.data?.type as string
    const type =
      typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none'

    const date = (inputs['date'] ? inputs['date'][0] : new Date()) as string

    if (!content) return console.log('Content is null, not storing document')

    console.log('owner is', owner ?? document.owner)
    const data = {
      ...document,
      owner: owner ?? document.owner,
      projectId,
      content,
      type,
      date,
    } as Document
    if (embedding) data.embedding = embedding

    if (content && content !== '') {
      const response = await axios.post(`${API_ROOT_URL}/documents`, data)
      return {
        output: response.data,
      }
    }
  }
}
