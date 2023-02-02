/* eslint-disable no-console */
import Handlebars from 'handlebars'
import Rete from 'rete'
import { CompletionData, makeCompletion } from '../../functions/makeCompletion'
import {
  EngineContext,
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { stringSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = `The generator component is our general purpose completion component.  You can define any number of inputs, and utilize those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your graph.

Controls have also been added which give you control of some of the fundamental settings of the OpenAI completion endpoint, including temperature, max tokens, and your stop sequence.

The componet has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. `

type WorkerReturn = {
  result: string
  composed: string
}

export class Generator extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Generator')
    this.task = {
      outputs: {
        result: 'output',
        composed: 'output',
        trigger: 'option',
      },
    }
    this.category = 'AI/ML'
    this.runFromCache = true
    this.info = info
    this.display = false
  }

  builder(node: MagickNode) {
    const dataIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const resultOut = new Rete.Output('result', 'Result', stringSocket)
    const composedOut = new Rete.Output('composed', 'Composed', stringSocket)

    node
      .addInput(dataIn)
      .addOutput(dataOut)
      .addOutput(resultOut)
      .addOutput(composedOut)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    // TODO refactor to a model dropdown to centralize models.
    // Even better to have an endpoint to call.
    // we could make a control that takes an arbitrary endpoint to get values from
    const modelName = new DropdownControl({
      name: 'modelName',
      dataKey: 'modelName',
      values: [
        'text-davinvci-003',
        'text-davinvci-002',
        'text-davinvci-001',
        'text-curie-001',
        'text-babbage-001',
        'text-ada-001',
        'curie-instruct-beta',
        'davinci-instruct-beta',
      ],
      defaultValue: 'text-davinci-002',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
    })

    const fewshotControl = new FewshotControl({
      language: 'handlebars',
    })

    const stopControl = new InputControl({
      dataKey: 'stop',
      name: 'Stop',
      icon: 'stop-sign',
      defaultValue: '',
    })

    const temperatureControl = new InputControl({
      dataKey: 'temp',
      name: 'Temperature',
      icon: 'temperature',
      defaultValue: 0.7,
    })

    const maxTokenControl = new InputControl({
      dataKey: 'max_tokens',
      name: 'Max Tokens',
      icon: 'moon',
      defaultValue: 50,
    })

    const frequency_penalty = new InputControl({
      dataKey: 'frequency_penalty',
      name: 'Frequency Penalty',
      defaultValue: 0,
    })

    node.inspector
      .add(nameControl)
      .add(modelName)
      .add(inputGenerator)
      .add(fewshotControl)
      .add(stopControl)
      .add(temperatureControl)
      .add(maxTokenControl)
      .add(frequency_penalty)

    return node
  }

  async worker(
    node: NodeData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    { magick }: { silent: boolean; magick: EngineContext }
  ) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const modelName = (node.data.modelName as string) || 'text-davinci-002'
    // const model = node.data.model || 'davinci'

    // Replace carriage returns with newlines because that's what the language models expect
    const fewshot = node.data.fewshot
      ? (node.data.fewshot as string).replace('\r\n', '\n')
      : ''
    const stopSequence = node.data.stop as string
    const topPData = node?.data?.top_p as string
    const top_p = topPData ? parseFloat(topPData) : 1
    const template = Handlebars.compile(fewshot, { noEscape: true })
    const prompt = template(inputs)

    const stop = node?.data?.stop
      ? stopSequence.split(',').map(i => {
          if (i.includes('\\n')) return '\n'
          return i.trim()
        })
      : []

    const tempData = node.data.temp as string
    const temperature = tempData ? parseFloat(tempData) : 0.7
    const maxTokensData = node?.data?.max_tokens as string
    const max_tokens = maxTokensData ? parseInt(maxTokensData) : 50
    const frequencyPenaltyData = node?.data?.frequency_penalty as string
    const frequency_penalty = frequencyPenaltyData
      ? parseFloat(frequencyPenaltyData)
      : 0

    const presencePenaltyData = node?.data?.presence_penalty as string
    const presence_penalty = presencePenaltyData
      ? parseFloat(presencePenaltyData)
      : 0

    const body: CompletionData = {
      prompt,
      stop,
      max_tokens,
      temperature,
      frequency_penalty,
      presence_penalty,
      top_p,
    }
    try {
      const { success, choice } = await makeCompletion(modelName, body)

      if (!success) throw new Error('Error in generator')

      const raw = choice.text
      const result = raw
      const composed = `${prompt}${result}`

      // if (!silent) node.display(result)

      return {
        result,
        composed,
      }
    } catch (err) {
      console.log({ err })
      // Typescript reporting wrong about number of arguments for error constructor
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore:next-line
      throw new Error('Error in Generator component.', { cause: err })
    }
  }
}
