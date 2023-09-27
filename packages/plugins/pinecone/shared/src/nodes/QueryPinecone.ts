// DOCUMENTED
import Rete from 'shared/rete'

import {
  arraySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  MagickNodeData,
  stringSocket,
  triggerSocket,
} from '@magickml/core'

import { PineconeClient } from '@pinecone-database/pinecone'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  result?: any[]
  error?: string
}

/**
 * QueryPinecone class which extends the MagickComponent.
 */
export class QueryPinecone extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for the QueryPinecone class.
   */
  constructor() {
    super(
      'Query Pinecone',
      {
        outputs: {
          result: 'output',
          error: 'output',
          trigger: 'option',
        },
      },
      'Pinecone',
      info
    )
  }

  /**
   * The builder function to assemble the node component.
   * @param node The MagickNode instance to be assembled.
   * @returns The assembled MagickNode instance.
   */
  builder(node: MagickNode): MagickNode {
    const embedding = new Rete.Input('embedding', 'Embedding', arraySocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const result = new Rete.Output('result', 'Result', arraySocket)
    const error = new Rete.Output('error', 'Error', stringSocket)

    const input = new InputControl({
      dataKey: 'environment',
      name: 'Environment',
      icon: 'moon',
      placeholder: '',
    })

    const index = new InputControl({
      dataKey: 'index',
      name: 'Index',
      icon: 'moon',
      placeholder: '',
    })
    node.inspector.add(input).add(index)

    return node
      .addInput(triggerIn)
      .addInput(embedding)
      .addOutput(triggerOut)
      .addOutput(result)
      .addOutput(error)
  }

  /**
   * The worker function contains the main business logic for the node.
   * It passes the results to the outputs to be consumed by any connected components.
   * @param node The MagickNodeData instance.
   * @param inputs The inputs from the MagickWorkerInputs.
   * @param _outputs The outputs from the MagickWorkerOutputs.
   * @param context The context object.
   */
  async worker(
    node: MagickNodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: any
  ) {
    const pinecone = new PineconeClient()

    if (!context.module.secrets['pinecone_api_key']) {
      console.log('No Pinecode API key found')
      return { error: 'No Pinecode API key found' }
    }
    const environment = (node.data as { environment: string }).environment

    console.log('inputs', inputs)

    const embedding =
      inputs['embedding'] && (inputs['embedding'][0] as Array<number>)

    await pinecone.init({
      environment,
      apiKey: context.module.secrets['pinecone_api_key'],
    })

    const index = (node.data as { index: string }).index

    const pineconeIndex = pinecone.Index(index)

    console.log('embedding is', embedding)

    const queryRequest = {
      vector: embedding,
      topK: 3,
      includeValues: true,
      includeMetadata: true,
    }

    const queryResponse = await pineconeIndex.query({ queryRequest })

    console.log('queryResponse', JSON.stringify(queryResponse))

    return {
      result: queryResponse?.matches ?? [],
    }
  }
}
