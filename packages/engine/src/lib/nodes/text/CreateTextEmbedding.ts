import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import {
  triggerSocket,
  stringSocket,
  arraySocket,
  booleanSocket,
} from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { DropdownControl } from '../../dataControls/DropdownControl'

import { pluginManager } from '../../plugin'

const info = 'Event Store is used to store events for an event and user'

type InputReturn = {
  success: boolean
  result: number[] | null
}

export class CreateTextEmbedding extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Create Text Embedding')

    this.task = {
      outputs: {
        trigger: 'option',
        embedding: 'output',
        success: 'option',
      },
    }

    this.category = 'Text'
    this.display = true
    this.info = info
  }

  // TODO: Add dynamic sockets
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const completionProviders = pluginManager.getCompletionProviders('text', ['embedding'])

    // get the models from the completion providers
    const models = completionProviders.map(p => p.models).flat()
    
    console.log('completionProviders', completionProviders)

    // add dropdown for completion providers
    const inputType = new DropdownControl({
      name: 'Model',
      dataKey: 'model',
      values: models,
      defaultValue: models[0],
    })

    node.inspector.add(inputType)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context
  ): Promise<InputReturn> {
    const completionHandler = node.data.completionHandler

    if (!completionHandler) {
      console.error('No completion handler found')
      return {
        success: false,
        result: null,
      }
    }

    const { success, result } = await completionHandler({
      node,
      inputs,
      outputs,
      context,
    })

    if (!success) {
      return {
        success: false,
        result: null,
      }
    }

    return {
      success: true,
      result: result,
    }
  }
}
