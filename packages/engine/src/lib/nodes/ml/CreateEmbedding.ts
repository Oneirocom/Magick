import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { triggerSocket, stringSocket, arraySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { makeEmbedding } from '../../functions/makeEmbedding'

const info = 'Event Store is used to store events for an event and user'

type InputReturn = {
  embedding: number[] | null
} | void

export class CreateEmbedding extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Create Embedding')

    this.task = {
      outputs: {
        embedding: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const out = new Rete.Output('embedding', 'Embedding', arraySocket)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { projectId, module }: { projectId: string; module: any }
  ) {
    const content = (inputs['content'] && inputs['content'][0]) as string

    if (!content) return console.log('Content is null, not storing event')

    if (!module.secrets['openai_api_key']) {
      return console.log('No OpenAI API key found')
    }

    const data = await makeEmbedding(
      {
        apiKey: module.secrets['openai_api_key'],
        input: content,
        model: 'text-embedding-ada-002',
      },
      {
        projectId,
        spell: node.spell,
        nodeId: node.id,
      }
    )

    if (!data) {
      return {
        embedding: null,
      }
    }

    console.log('embedding data', data)
    
    const responseData = data?.data[0]?.embedding
    return {
      embedding: responseData,
    }
  }
}
