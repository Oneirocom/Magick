import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  EngineContext,
} from '../../../core/types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { DropdownControl } from '../../dataControls/DropdownControl'

const info = 'Basic text completion using OpenAI.'

type WorkerReturn = {
  output: string
}

export class TextCompletion extends MagickComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super('Text Completion')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const settings = new Rete.Input('settings', 'Settings', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    const modelName = new DropdownControl({
      name: 'modelName',
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
      defaultValue: 'text-davinci-002',
    })

    const temperature = new InputControl({
      dataKey: 'temperature',
      name: 'Temperature',
      icon: 'moon',
      defaultValue: 0.5,
    })

    const maxTokens = new InputControl({
      dataKey: 'maxTokens',
      name: 'Max Tokens',
      icon: 'moon',
      defaultValue: 100,
    })

    const topP = new InputControl({
      dataKey: 'topP',
      name: 'Top P',
      icon: 'moon',
      defaultValue: 1,
    })

    const frequencyPenalty = new InputControl({
      dataKey: 'frequencyPenalty',
      name: 'Frequency Penalty',
      icon: 'moon',
      defaultValue: 0,
    })

    const presencePenalty = new InputControl({
      dataKey: 'presencePenalty',
      name: 'Presence Penalty',
      icon: 'moon',
      defaultValue: 0,
    })

    const stop = new InputControl({
      dataKey: 'stop',
      name: 'Stop',
      icon: 'moon',
      defaultValue: '',
    })

    node.inspector
      .add(modelName)
      .add(temperature)
      .add(maxTokens)
      .add(topP)
      .add(frequencyPenalty)
      .add(presencePenalty)
      .add(stop)

    return node
      .addInput(inp)
      .addInput(settings)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { magick }: { magick: EngineContext }
  ) {
    const { completion } = magick

    const prompt = inputs['string'][0]
    const settings = ((inputs.settings && inputs.settings[0]) ?? {}) as any
    const modelName = settings.modelName ?? (node?.data?.modelName as string)
    const temperatureData =
      settings.temperature ?? (node?.data?.temperature as string)
    const temperature = parseFloat(temperatureData)
    const maxTokensData =
      settings.max_tokens ?? (node?.data?.maxTokens as string)
    const maxTokens = parseInt(maxTokensData)
    const topPData = settings.top_p ?? (node?.data?.topP as string)
    const topP = parseFloat(topPData)
    const frequencyPenaltyData =
      settings.frequency_penalty ?? (node?.data?.frequencyPenalty as string)
    const frequencyPenalty = parseFloat(frequencyPenaltyData)
    const presencePenaltyData =
      settings.presence_penalty ?? (node?.data?.presencePenalty as string)
    const presencePenalty = parseFloat(presencePenaltyData)
    const stop = settings.stop ?? (node?.data?.stop as string).split(', ')
    for (let i = 0; i < stop.length; i++) {
      if (stop[i] === '\\n') {
        stop[i] = '\n'
      }
    }
    const filteredStop = stop.filter(function (el: any) {
      return el != null && el !== undefined && el.length > 0
    })

    const body = {
      prompt: prompt as string,
      modelName,
      temperature,
      maxTokens,
      topP,
      frequencyPenalty,
      presencePenalty,
      stop: filteredStop,
    }

    const data = await completion(body)

    const { success, choice } = data

    if (!success) {
      console.error('Error in text completion', data)
      throw new Error('Error in text completion')
    }

    const res =
      success !== 'false' && success !== false ? choice.text : '<error>'

    console.log('success:', success, 'choice:', choice.text, 'res:', res)

    return {
      output: res,
    }
  }
}
