/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  TaskOptions,
  stringSocket,
  triggerSocket,
  MagickComponent,
  API_ROOT_URL,
} from '@magickml/engine'
const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  summary: string
  links: string
}

export class SearchGoogle extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Search Google')

    this.task = {
      outputs: {
        summary: 'output',
        links: 'output',
        trigger: 'option',
      },
    } as TaskOptions
    this.category = 'Search'
    this.info = info
  }
  // the builder is used to "assemble" the node component.

  builder(node: MagickNode): MagickNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const query = new Rete.Input('query', 'Query', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const summary = new Rete.Output('summary', 'Summary', stringSocket)
    const links = new Rete.Output('links', 'Links', stringSocket)

    return node
      .addInput(triggerIn)
      .addInput(query)
      .addOutput(triggerOut)
      .addOutput(summary)
      .addOutput(links)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    _node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ) {
    const url = `${API_ROOT_URL}/query_google`

    const body = JSON.stringify({ query: inputs.query[0] })

    // write a fetch post to SERVER_URL/query_google with the parameter query in the body
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })

    const json = await response.json()

    const { summary, links } = json

    return {
      summary,
      links,
    }
  }
}
