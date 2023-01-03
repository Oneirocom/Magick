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
import { triggerSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Document Store Get is used to get a document store from the search corpus'

type WorkerReturn = {
  output: string
}

export class DocumentStoreGet extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Document Store Get')

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

  builder(node: ThothNode) {
    const nameInput = new Rete.Input('name', 'Store Name', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(nameInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    const name = inputs['name'][0] as string

    const resp = await axios.get(
      `${import.meta.env.VITE_APP_SEARCH_SERVER_URL}/document-store/${name}`
    )

    return {
      output: resp?.data?.id ?? 0,
    }
  }
}
