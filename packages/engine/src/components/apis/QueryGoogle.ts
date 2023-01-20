import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { queryGoogleSearch } from '../../functions/queryGoogle'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

type WorkerReturn = {
  summary: string,
  links: string
}

export class QueryGoogle extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    // Name of the component
    super('Query Google')

    this.task = {
      outputs: {
        summary: 'output',
        links: 'output',
        trigger: 'option',
      },
      init: () => {},
      onRun: () => {},
    } as TaskOptions
    this.category = 'APIs'
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
    _outputs: MagickWorkerOutputs,
    { magick }: { magick: EngineContext }
  ) {
    const query = inputs.query[0] as string
    const {summary, links} = await queryGoogleSearch(query)
    console.log('summary, links', summary, links)
    return {
      summary,
      links
    }
  }
}
