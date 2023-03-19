/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import Rete from 'rete'

import {
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  stringSocket,
  TaskOptions,
  triggerSocket,
} from '@magickml/engine'

import { PineconeClient } from '@pinecone-database/pinecone'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  result?: string
  error?: string
}

export class QueryPinecone extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Query Pinecone')

    this.task = {
      outputs: {
        summary: 'output',
        links: 'output',
        trigger: 'option',
      },
    } as TaskOptions
    this.category = 'Pinecone'
    this.info = info
  }
  // the builder is used to "assemble" the node component.

  builder(node: MagickNode): MagickNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const query = new Rete.Input('query', 'Query', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const result = new Rete.Output('result', 'Result', stringSocket)
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

    const namespace = new InputControl({
      dataKey: 'namespace',
      name: 'Namespace',
      icon: 'moon',
      placeholder: '',
    })

    node.inspector.add(input).add(index).add(namespace)

    return node
      .addInput(triggerIn)
      .addInput(query)
      .addOutput(triggerOut)
      .addOutput(result)
      .addOutput(error)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    module: any
  ) {
    const pinecone = new PineconeClient()

    if (!module.secrets['pinecone_api_key']) {
      console.log('No Pinecode API key found')
      return { error: 'No Pinecode API key found' }
    }
    const environment = node.data.environment as string

    const namespace = node.data.namespace as string

    await pinecone.init({
      environment,
      apiKey: module.secrets['pinecone_api_key'],
    })

    const query = inputs['query'][0] as string
    const index = inputs['index'][0] as string

    const pineconeIndex = pinecone.Index(index)

    const queryRequest = {
      vector: [0.1, 0.2, 0.3, 0.4],
      topK: 10,
      includeValues: true,
      includeMetadata: true,
      filters: query,
      namespace,
    }

    const queryResponse = await pineconeIndex.query({ queryRequest })

    return {
      result: JSON.stringify(queryResponse),
    }
  }
}
