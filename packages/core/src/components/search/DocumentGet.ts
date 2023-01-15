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
} from '../../../types'
import { triggerSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Document Get is used to get a document from the search corpus'

type WorkerReturn = {
  output: string
}

export class DocumentGet extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Document Get')

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
    const idInput = new Rete.Input('id', 'ID', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', anySocket)

    return node
      .addInput(idInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(
    _node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { magick: EngineContext }
  ) {
    const { env } = context.magick
    const id = inputs['id'][0] as string

    const resp = await axios.get(`${env.APP_SEARCH_SERVER_URL}/document/${id}`)

    return {
      output: resp.data,
    }
  }
}
