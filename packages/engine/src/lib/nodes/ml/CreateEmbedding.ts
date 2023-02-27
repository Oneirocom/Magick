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
        const out = new Rete.Output('embedding', 'Events', arraySocket)

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
        { projectId }: { projectId: string },
    ) {
        const content = (inputs['content'] && inputs['content'][0]) as string
        console.log('projectId', projectId)
        if (!content) return console.log('Content is null, not storing event')

        const data = await makeEmbedding({
            input: content,
            model: 'text-embedding-ada-002',
        }, projectId)

        console.log('data', data)

        if(!data || !data.success) {
            return {
                embedding: null
            }
        }

        const [responseData] = data?.data
        const embedding = responseData.embedding

        return {
            embedding
        }
    }
}
