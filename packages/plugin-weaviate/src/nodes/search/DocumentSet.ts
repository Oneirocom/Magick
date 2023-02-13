/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from 'packages/engine/src/types'
import {
  triggerSocket,
  stringSocket,
  booleanSocket,
  numSocket,
  anySocket,
} from 'packages/engine/src/sockets'
import { MagickComponent } from 'packages/engine/src/magick-component'

const info = 'Document Set is used to add a document in the search corpus'

export class DocumentSet extends MagickComponent<void> {
  constructor() {
    super('Document Set')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Search'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const storeIdInput = new Rete.Input('storeId', 'Store ID', numSocket)
    const titleInput = new Rete.Input('title', 'title', stringSocket)
    const descriptionInput = new Rete.Input(
      'description',
      'Description',
      stringSocket
    )
    const isIncludedInput = new Rete.Input(
      'isIncluded',
      'Is Included',
      booleanSocket
    )
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(storeIdInput)
      .addInput(titleInput)
      .addInput(descriptionInput)
      .addInput(isIncludedInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { magick: EngineContext; silent: boolean }
  ) {
    const { env } = context.magick
    const storeId = inputs['storeId'][0]
    const title = inputs['title'] ? (inputs['title'][0] as string) : ''
    const description = inputs['description']
      ? (inputs['description'][0] as string)
      : ''
    const isIncluded = inputs['isIncluded'][0] as string

    const resp = await axios.post(`${env.APP_SEARCH_SERVER_URL}/document`, {
      title,
      description,
      isIncluded,
      storeId,
    })
    node.display(resp.data)
    console.log('resp.data.documentId', resp.data.documentId)
    return {
      output: resp.data.documentId,
    }
  }
}
