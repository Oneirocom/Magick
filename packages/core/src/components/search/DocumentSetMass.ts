import.meta.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, numSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Document Set Mass is used to add multiple documents in the search corpus'

export class DocumentSetMass extends ThothComponent<void> {
  constructor() {
    super('Document Set Mass')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Search'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const storeIdInput = new Rete.Input('storeId', 'Store ID', numSocket)
    const documentsInput = new Rete.Input('documents', 'Documents', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const storeName = new InputControl({
      dataKey: 'store_name',
      name: 'Store Name',
    })

    node.inspector.add(storeName)

    return node
      .addInput(storeIdInput)
      .addInput(documentsInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    const storeId = inputs['storeId']?.[0]
    let documents = inputs['documents']
    // eslint-disable-next-line camelcase
    const store_name = node?.data?.store_name as string

    if (typeof documents === 'string') {
      documents = JSON.parse(documents)
    }
    if (typeof documents === 'object' && documents?.length === 1) {
      documents = documents[0] as any
    }

    if (documents.length > 100) {
      let temp: any[] = []
      let t = 1
      for (let i = 0; i < documents.length; i++) {
        temp.push(documents[i])
        if (i >= t * 100 || i === documents.length - 1) {
          await axios.post(
            `${import.meta.env.VITE_APP_SEARCH_SERVER_URL}/document_mass`,
            {
              documents: temp,
              storeId,
              store_name,
            }
          )
          temp = []
          t++
        }
      }
    }
    return {
      output: 0,
    }
  }
}
