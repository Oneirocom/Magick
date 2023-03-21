import Rete from 'rete'

import { DropdownControl } from '../../dataControls/DropdownControl'
import { MagickComponent } from '../../magick-component'
import { pluginManager } from '../../plugin'
import { anySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  EngineContext, MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs, NodeData
} from '../../types'

const info = 'Basic text completion using OpenAI.'

type WorkerReturn = {
  success: boolean
  output: string
} | void

export class GenerateText extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Generate Text')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Text'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const settings = new Rete.Input('settings', 'Settings', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)


    const completionProviders = pluginManager.getCompletionProviders('text', ['embedding'])

    console.log('completionProviders', completionProviders)

    const modelName = new DropdownControl({
      name: 'Model Name',
      dataKey: 'modelName',
      values: [
        'text-davinci-003',
        'text-davinci-002',
        'text-davinci-001',
        'text-curie-001',
        'text-babbage-001',
        'text-ada-001',
        'curie-instruct-beta',
        'davinci-instruct-beta',
      ],
      defaultValue: 'text-davinci-003',
    })

    node.inspector
      .add(modelName)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addInput(settings)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: { module: any, secrets: Record<string, string>; projectId: string; magick: EngineContext }
  ) {
    
    
    // const { success, result } = await makeTextCompletion(
    //   {node,
    //   inputs,
    //   outputs,
    //   context,
    //   }
    // )

    // if (!success) {
    //   node.data.error = true
    //   console.error('Error in text completion')
    //   return {
    //     succes: false,
    //   }
    // }

    const success = false

    // const res =
    //   success !== 'false' && success !== false ? result.text : '<error>'

    // console.log('success:', success, 'choice:', result.text, 'res:', res)

    return {
      success: true,
      output: null// res,
    }
  }
}
