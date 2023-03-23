import Rete from 'rete'

import { API_ROOT_URL } from '../../config'
import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types'

const info = 'Get a cached embedding for this exact string'

type InputReturn = {
  embedding: number[] | null
}

export class FindTextEmbedding extends MagickComponent<
  Promise<InputReturn | null>
> {
  constructor() {
    super('Find Text Embedding')

    this.task = {
      outputs: {
        embedding: 'output',
        failure: 'option',
        success: 'option',
      },
    }

    this.category = 'Embedding'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const success = new Rete.Output('success', 'Success', triggerSocket)
    const fail = new Rete.Output('failure', 'Failure', triggerSocket)
    const out = new Rete.Output('embedding', 'Events', arraySocket)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addOutput(success)
      .addOutput(fail)
      .addOutput(out)
  }

  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {
    const content = (inputs['content'] && inputs['content'][0]) as string

    if (!content) {
      console.log('Content is null, not storing event')
      return null
    }
    // feathers 5 query params
    const params = {
      content: content,
      $limit: 1,
      getEmbedding: true,
    }

    const urlString = `${API_ROOT_URL}/events`

    const url = new URL(urlString)
    for (const p in params) {
      // append params to url, make sure to preserve arrays
      if (Array.isArray(params[p])) {
        params[p].forEach(v => url.searchParams.append(p, v))
      } else {
        url.searchParams.append(p, params[p])
      }
    }
    const response = await fetch(url.toString())
    if (response.status !== 200) return null
    const json = await response.json()
    
    const responseData = json.events[0]
    let embedding = responseData?.embedding?.toString()
    // if embedding is a string, parse it to an array
    if (typeof embedding === 'string') {
      embedding = JSON.parse(JSON.stringify(embedding))
    }
    if (embedding) {
      this._task.closed = ['failure']
    } else {
      this._task.closed = ['success']
    }
    return {
      embedding,
    }
  }
}
