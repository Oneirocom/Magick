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
import { triggerSocket, numSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info =
  'Document Delete is used to delete a document from the search corpus'

export class DocumentDelete extends MagickComponent<void> {
  constructor() {
    super('Document Delete')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Search'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const docIdInput = new Rete.Input('docId', 'Document Id', numSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node.addInput(docIdInput).addInput(dataInput).addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _: MagickWorkerOutputs,
    { magick }: { magick: EngineContext }
  ) {
    const { env } = magick
    const docId = inputs['docId'][0]
    node.display(docId)
    const resp = await axios.delete(`${env.APP_SEARCH_SERVER_URL}/document`, {
      params: {
        documentId: docId,
      },
    })
    node.display(resp.data)
  }
}
