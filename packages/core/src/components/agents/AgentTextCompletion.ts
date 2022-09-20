/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { triggerSocket, stringSocket, anySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Agent Text Completion is using OpenAI for the agent to respond.'

type WorkerReturn = {
  output: string
}

export class AgentTextCompletion extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Agent Text Completion')

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

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const settings = new Rete.Input('settings', 'Settings', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'output', stringSocket)

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

  async worker(node: NodeData, inputs: ThothWorkerInputs) {
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
    const stop = settings.stop ?? (node?.data?.stop as string).split(',')
    for (let i = 0; i < stop.length; i++) {
      stop[i] = stop[i].trim()
      if (stop[i] === '\\n') {
        stop[i] = '\n'
      }
    }
    const filteredStop = stop.filter(function (el: any) {
      return el != null && el !== undefined && el.length > 0
    })

    console.log('filteredStop is', filteredStop)

    const resp = await axios.post(
      `${
        import.meta.env.VITE_APP_API_URL ??
        import.meta.env.VITE_API_URL ??
        'https://localhost:8001'
      }/text_completion`,
      {
        prompt: prompt,
        modelName: modelName,
        temperature: temperature,
        maxTokens: maxTokens,
        topP: topP,
        frequencyPenalty: frequencyPenalty,
        presencePenalty: presencePenalty,
        stop: filteredStop,
      }
    )
    console.log('resp.data is ', resp.data)

    const { success, choice } = resp.data

    if (!success)
      return {
        output:
          'Sorry, I had a completion error:' +
          JSON.stringify(resp.data) +
          ' prompt:' +
          JSON.stringify(prompt),
      }

    const res =
      success !== 'false' && success !== false
        ? choice.text
        : 'Sorry, I had an error!'

    console.log('success:', success, 'choice:', choice.text, 'res:', res)

    return {
      output: res,
    }
  }
}
