import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  EngineContext,
} from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { makeCompletion } from '../../functions/makeCompletion'

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

    const max_tokens = new InputControl({
      dataKey: 'max_tokens',
      name: 'Max Tokens',
      icon: 'moon',
      defaultValue: 100,
    })

    const top_p = new InputControl({
      dataKey: 'top_p',
      name: 'Top P',
      icon: 'moon',
      defaultValue: 1,
    })

    const frequency_penalty = new InputControl({
      dataKey: 'frequency_penalty',
      name: 'Frequency Penalty',
      icon: 'moon',
      defaultValue: 0,
    })

    const presence_penalty = new InputControl({
      dataKey: 'presence_penalty',
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
      .add(max_tokens)
      .add(top_p)
      .add(frequency_penalty)
      .add(presence_penalty)
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
  ) {
    const prompt = inputs['string'][0]
    const settings = ((inputs.settings && inputs.settings[0]) ?? {}) as any
    const modelName = settings.modelName ?? (node?.data?.modelName as string)
    const temperatureData =
      settings.temperature ?? (node?.data?.temperature as string)
    const temperature = parseFloat(temperatureData)
    const maxTokensData =
      settings.max_tokens ?? (node?.data?.max_tokens as string)
    const max_tokens = parseInt(maxTokensData)
    const topPData = settings.top_p ?? (node?.data?.top_p as string)
    const top_p = parseFloat(topPData)
    const frequencyPenaltyData =
      settings.frequency_penalty ?? (node?.data?.frequency_penalty as string)
    const frequency_penalty = parseFloat(frequencyPenaltyData)
    const presencePenaltyData =
      settings.presence_penalty ?? (node?.data?.presence_penalty as string)
    const presence_penalty = parseFloat(presencePenaltyData)
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
      temperature,
      max_tokens,
      model: modelName ?? 'text-davinci-002',
      top_p,
      frequency_penalty,
      presence_penalty,
      stop: filteredStop,
    }

    const data = await makeCompletion(body)

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
