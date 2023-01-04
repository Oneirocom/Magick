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
  'Search is used to do neural search in the search corpus and return a document'

type Document = {
  title: string
  description: string
}

type WorkerReturn = {
  output: unknown
}

export class Search extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Search Documents')

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
      'searchStr',
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

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
    const searchStr = inputs['searchStr'][0] as string
    console.log('SEARCHING FOR:', searchStr)
    const documents: Document[] = []
    const resp = await axios.get(
      `${import.meta.env.VITE_APP_SEARCH_SERVER_URL}/search`,
      {
        params: {
          question: searchStr,
        },
      }
    )
    if (typeof resp.data === 'object') {
      documents.push({
        title: resp.data.title,
        description: resp.data.description,
      })
    }
    node.display(documents)

    return {
      output: documents,
    }
  }
}
