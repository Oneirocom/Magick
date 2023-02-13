import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket, arraySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { API_ROOT_URL } from '../../config'

import qs from 'qs'

const info = 'Get a cached embedding for this exact string'

type InputReturn = {
  embedding: number[] | null
} | void

export class GetCachedEmbedding extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Get Cached Embedding')

    this.task = {
      outputs: {
        embedding: 'output',
        failure: 'option',
        success: 'option',
      },
    }

    this.category = 'AI/ML'
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
      .addInput(contentInput)
      .addInput(dataInput)
      .addOutput(success)
      .addOutput(fail)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const content = (inputs['content'] && inputs['content'][0]) as string

    if (!content) return console.log('Content is null, not storing event')

    // feathers 5 query params
    const params = {
      content: content,
      $limit: 1,
      getEmbedding: true
    }

    const urlString = `${API_ROOT_URL}/events`

    const url = new URL(urlString)
    for (let p in params) {
      // append params to url, make sure to preserve arrays
      if (Array.isArray(params[p])) {
        params[p].forEach((v) => url.searchParams.append(p, v))
      } else {
        url.searchParams.append(p, params[p])
      }
    }

    const response = await fetch(url.toString())
    if (response.status !== 200) return null
    const json = await response.json()

    const responseData = json.data[0]

    const embedding = responseData.embedding

    if (embedding) {
      this._task.closed = ['failure']
    } else {
      this._task.closed = ['success']
    }

    return {
      embedding
    }
  }
}
