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
import { triggerSocket, anySocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Vector Search is used to do neural search in the search corpus and return a document'

type WorkerReturn = {
  output: unknown
}

export class VectorSearch extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Vector Search')

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
    const searchStrInput = new Rete.Input(
      'input',
      'Search String',
      stringSocket
    )
    const dataInput = new Rete.Input(
      'trigger',
      'Trigger In',
      triggerSocket,
      true
    )
    const dataOutput = new Rete.Output('trigger', 'Trigger Out', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(searchStrInput)
      .addInput(dataInput)
      .addOutput(output)
      .addOutput(dataOutput)
  }

  async worker(_node: NodeData, inputs: ThothWorkerInputs) {
    console.log('inputs:', inputs)
    const searchStr = inputs['input'][0] as string
    console.log(
      'requesting to:',
      `${import.meta.env.VITE_APP_SEARCH_SERVER_URL}/vector_search`
    )
    console.log('searchStr:', searchStr)
    const resp = await axios.post(
      `${import.meta.env.VITE_APP_SEARCH_SERVER_URL}/vector_search`,
      {
        question: searchStr,
      }
    )

    console.log(resp.data)

    return {
      output: resp.data,
    }
  }
}
