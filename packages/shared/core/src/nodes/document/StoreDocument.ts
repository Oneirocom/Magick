// DOCUMENTED
import Rete from 'shared/rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { embeddingSocket, stringSocket, triggerSocket } from '../../sockets'
import {
  Document,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'

/** StoreDocument class for storing documents */
export class StoreDocument extends MagickComponent<Promise<void>> {
  /**
   * Constructor for StoreDocument class
   */
  constructor() {
    super(
      'Store Documents',
      {
        outputs: {
          trigger: 'option',
        },
      },
      'Storage/Documents',
      'Store Documents in the Documents store. Stores the content, embedding, and date from the inputs as well as an optional Type property.'
    )

    this.common = true
  }

  /**
   * Builder for the StoreDocument class
   * @param {MagickNode} node - The node to update.
   * @returns {MagickNode} The updated node.
   */
  builder(node: MagickNode): MagickNode {
    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Input name',
      placeholder: 'Conversation',
      tooltip: 'Enter input name',
    })

    const type = new InputControl({
      dataKey: 'type',
      name: 'Type',
      icon: 'moon',
      placeholder: 'conversation',
      tooltip: 'Enter input type',
    })

    const contentInput = new Rete.Input('content', 'Content', stringSocket)
    const embedding = new Rete.Input('embedding', 'Embedding', embeddingSocket)
    const date = new Rete.Input('date', 'Date', stringSocket)
    const typeInput = new Rete.Input('type', 'Type', stringSocket)

    node.inspector.add(nameInput).add(type)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node
      .addInput(dataInput)
      .addInput(contentInput)
      .addInput(date)
      .addInput(typeInput)
      .addInput(embedding)
      .addOutput(dataOutput)
  }

  /**
   * Worker for the StoreDocument class
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - The worker inputs.
   * @param {MagickWorkerOutputs} _outputs - The worker outputs.
   * @param {any} context - The context.
   * @returns {Promise<void>} The output of the worker.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<void> {
    const { projectId } = context

    const content = (inputs['content'] ? inputs['content'][0] : null) as string
    const typeInput = (inputs['type'] ? inputs['type'][0] : null) as string

    const _embedding = (inputs['embedding'] ? inputs['embedding'][0] : null) as
      | number[]
      | string[]

    let embedding: number[]

    if (typeof _embedding === 'string') {
      embedding = (_embedding as string).split(',').map(parseFloat)
    } else {
      embedding = _embedding as number[]
    }

    const nodeData = node.data as { type: string }
    const typeData = nodeData.type as string
    const type =
      typeInput ??
      (typeData !== undefined && typeData.length > 0
        ? typeData.toLowerCase().trim()
        : 'none')

    const date = (inputs['date'] ? inputs['date'][0] : new Date()) as string

    if (!content) {
      return console.log('Content is null, not storing document')
    }

    const data = {
      projectId,
      content,
      type,
      date,
    } as Document

    if (embedding) {
      data.embedding = embedding
    }
    if (content && content !== '') {
      const { app } = context.module
      if (!app) throw new Error('App is not defined, cannot create event')
      await app.service('documents').create(data)
    } else {
      throw new Error('Content is empty')
    }
  }
}
