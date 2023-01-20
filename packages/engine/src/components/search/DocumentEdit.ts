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
} from '../../types'
import {
  triggerSocket,
  stringSocket,
  booleanSocket,
  numSocket,
} from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Document Edit is used to edit a document in the search corpus'

export class DocumentEdit extends MagickComponent<void> {
  constructor() {
    super('Document Edit')

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
    const documentId = new Rete.Input('documentId', 'documentId', numSocket)
    const storeIdInput = new Rete.Input('storeId', 'Store ID', numSocket)
    const keywordsInput = new Rete.Input('keywords', 'Keywords', stringSocket)
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

    return node
      .addInput(storeIdInput)
      .addInput(documentId)
      .addInput(keywordsInput)
      .addInput(descriptionInput)
      .addInput(isIncludedInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { silent, magick }: { silent: boolean; magick: EngineContext }
  ) {
    const { env } = magick
    const documentId = inputs['documentId'][0]
    const storeId = inputs['storeId'][0]
    const keywords = inputs['keywords'] ? (inputs['keywords'][0] as string) : ''
    const description = inputs['description']
      ? (inputs['description'][0] as string)
      : ''
    const is_included = inputs['isIncluded'][0] as string
    console.log('inputs', inputs)
    const resp = await axios.post(
      `${env.APP_SEARCH_SERVER_URL}/update_document`,
      {
        documentId,
        keywords,
        description,
        is_included,
        storeId,
      }
    )
    if (!silent) node.display(resp.data)
  }
}
