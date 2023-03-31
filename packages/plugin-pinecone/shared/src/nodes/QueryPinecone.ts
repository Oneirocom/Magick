/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import Rete from 'rete'

import {
  embeddingSocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  MagickNodeData,
  stringSocket,
  triggerSocket,
  arraySocket,
} from '@magickml/engine'

import { PineconeClient } from '@pinecone-database/pinecone'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  result?: any[]
  error?: string
}

export class QueryPinecone extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
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
  // the builder is used to "assemble" the node component.

  builder(node: MagickNode): MagickNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const embedding = new Rete.Input('embedding', 'Embedding', embeddingSocket)
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

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
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

    const embedding = inputs['embedding'] && inputs['embedding'][0] as Array<number>

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
      includeMetadata: true
    }

    const queryResponse = await pineconeIndex.query({ queryRequest })

    console.log('queryResponse', JSON.stringify(queryResponse))

    return {
      result: queryResponse?.matches ?? [],
    }
  }
}
