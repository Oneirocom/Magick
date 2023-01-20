import Rete from 'rete'

import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../../core/types'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { anySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `Given a keyword pull in relevant information of the wevaiate wikipedia instance.`

export class GetWikipediaSummary extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Get Wikipedia Summary')

    this.task = {
      outputs: {
        result: 'output',
        success: 'option',
        error: 'error',
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
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const keywordInput = new Rete.Input('keyword', 'Keyword', stringSocket)

    const successTrigger = new Rete.Output('success', 'Success', triggerSocket)
    const errorTrigger = new Rete.Output('error', 'Error', triggerSocket)
    const resultOutput = new Rete.Output('result', 'Result', anySocket)

    return node
      .addInput(dataInput)
      .addInput(keywordInput)
      .addOutput(successTrigger)
      .addOutput(resultOutput)
      .addOutput(errorTrigger)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  async worker(
    _node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { magick }: { magick: EngineContext }
  ) {
    this._task.closed = ['success', 'error']
    const { getWikipediaSummary } = magick
    try {
      const result = (await getWikipediaSummary(
        inputs.keyword[0] as string
      )) as any
      console.log('result', result)
      this._task.closed = ['error']
      return {
        result: result.result.extract,
      }
    } catch (err) {
      console.warn('Error getting wikipedia summary', err)
      this._task.closed = ['success']
      return {
        result: null,
      }
    }
  }
}
