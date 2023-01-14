import axios from 'axios'
import Rete from 'rete'

import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  EngineContext,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'Custom Text Completion is using OpenAI for the agent to respond.'

type WorkerReturn = {
  output: string
}

export class CustomTextCompletion extends MagickComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super('Custom Text Completion')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const settings = new Rete.Input('settings', 'Settings', anySocket)
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    const modelName = new InputControl({
      dataKey: 'modelName',
      name: 'Model Name',
      icon: 'moon',
    })

    const temperature = new InputControl({
      dataKey: 'temperature',
      name: 'Temperature',
      icon: 'moon',
    })

    const maxTokens = new InputControl({
      dataKey: 'maxTokens',
      name: 'Max Tokens',
      icon: 'moon',
    })

    const topP = new InputControl({
      dataKey: 'topP',
      name: 'Top P',
      icon: 'moon',
    })

    const frequencyPenalty = new InputControl({
      dataKey: 'frequencyPenalty',
      name: 'Frequency Penalty',
      icon: 'moon',
    })

    const presencePenalty = new InputControl({
      dataKey: 'presencePenalty',
      name: 'Presence Penalty',
      icon: 'moon',
    })

    const stop = new InputControl({
      dataKey: 'stop',
      name: 'Stop',
      icon: 'moon',
    })

    node.inspector
      .add(inputGenerator)
      .add(modelName)
      .add(temperature)
      .add(maxTokens)
      .add(topP)
      .add(frequencyPenalty)
      .add(presencePenalty)
      .add(stop)

    return node
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(settings)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(
    node: NodeData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { magick }: { magick: EngineContext }
  ) {
    const { completion } = magick

    const agent = rawInputs['agent'][0] as string
    const speaker = rawInputs['speaker'][0] as string
    const inputs: any = Object.entries(rawInputs).reduce(
      (acc, [key, value]) => {
        console.log('key:', key, 'value:', value)
        acc[key] = value[0]
        return acc
      },
      {} as Record<string, unknown>
    )

    let data = ''
    data += `The following is a conversation with ${agent} and ${speaker}.\n`
    data += (inputs['Static Chat'] as string) ?? '' + '\n'
    data += inputs['Chat']
    data += '\n' + agent + ':'

    const settings = ((rawInputs.settings && rawInputs.settings[0]) ??
      {}) as any
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
    const stop = settings.stop ?? (node?.data?.stop as string).split(',')
    for (let i = 0; i < stop.length; i++) {
      stop[i] = stop[i].trim()
      if (stop[i] === '\\n') {
        stop[i] = '\n'
      }
    }
    stop.push('\n\n')
    stop.push('\n\n\n')

    const filteredStop = stop.filter(function (el: any) {
      return el != null && el !== undefined && el.length > 0
    })

    const body = {
      prompt: data,
      modelName: modelName,
      temperature: temperature,
      maxTokens: maxTokens,
      topP: topP,
      frequencyPenalty: frequencyPenalty,
      presencePenalty: presencePenalty,
      stop: filteredStop,
      agent: agent,
      speaker: speaker,
      sender: speaker,
    }

    const resp = await completion(body)

    const { success, choice } = resp

    if (!success) {
      console.error('error:', choice.text)
      return {
        output: '<error>',
      }
    }

    return {
      output:
        success !== 'false' && success !== false ? choice.text : '<error>',
    }
  }
}
