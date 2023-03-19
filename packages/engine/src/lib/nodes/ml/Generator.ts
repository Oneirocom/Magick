import Handlebars from 'handlebars'
import Rete from 'rete'
import { DropdownControl } from '../../dataControls/DropdownControl'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { CompletionData, makeCompletion } from '../../functions/makeCompletion'
import { MagickComponent } from '../../magick-component'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  EngineContext, MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs, NodeData
} from '../../types'

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

    // TODO refactor to a model dropdown to centralize models.
    // Even better to have an endpoint to call.
    // we could make a control that takes an arbitrary endpoint to get values from
    const modelName = new DropdownControl({
      name: 'Model Name',
      dataKey: 'modelName',
      values: [
        'gpt-4',
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
      name: 'Stop (Comma Separated)',
      icon: 'stop-sign',
      defaultValue: '###',
    })

    const temperatureControl = new InputControl({
      dataKey: 'temperature',
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

    const presence_penalty = new InputControl({
      dataKey: 'presence_penalty',
      name: 'presence_penalty Penalty',
      defaultValue: 0,
    })

    node.inspector
      .add(modelName)
      .add(inputGenerator)
      .add(fewshotControl)
      .add(temperatureControl)
      .add(maxTokenControl)
      .add(frequency_penalty)
      .add(presence_penalty)
      .add(stopControl)

    return node
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async worker(
    node: NodeData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: {
      module: any
      secrets: Record<string, string>
      projectId: string
      magick: EngineContext
    }
  ) {
    const { projectId, magick } = context

    const currentSpell = magick.getCurrentSpell()
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const speakerName = inputs.speakerName

    const modelName = node?.data?.modelName as string

    // Replace carriage returns with newlines because that's what the language models expect
    const fewshot = node.data.fewshot
      ? (node.data.fewshot as string).replace('\r\n', '\n')
      : ''

    const topPData = node?.data?.top_p as string
    const top_p = topPData ? parseFloat(topPData) : 1

    const template = Handlebars.compile(fewshot, { noEscape: true })
    const prompt = template(inputs)

    const temperatureData = node?.data?.temperature as string
    const temperature = parseFloat(temperatureData)

    const maxTokensData = node?.data?.max_tokens as string
    const max_tokens = parseInt(maxTokensData)

    const frequencyPenaltyData = node?.data?.frequency_penalty as string
    const frequency_penalty = parseFloat(frequencyPenaltyData ?? '0')

    const presencePenaltyData = node?.data?.presence_penalty as string
    const presence_penalty = parseFloat(presencePenaltyData ?? '0')

    const stopData = node?.data?.stop as string
    const stop = (stopData ?? '').split(',')

    for (let i = 0; i < stop.length; i++) {
      // trim any spaces from the beginning and end
      stop[i] = stop[i].replace(/^\s+|\s+$/g, '')
      if (stop[i] === '\\n') {
        stop[i] = '\n'
      }
    }

    stop.push(speakerName + ':')
    console.log('stop', stop)

    const filteredStop = stop.filter(function (el: any) {
      return el != null && el !== undefined && el.length > 0
    })

    const body: CompletionData = {
      prompt,
      temperature,
      max_tokens,
      model: modelName ?? 'text-davinci-002',
      top_p,
      frequency_penalty,
      presence_penalty,
      stop: filteredStop,
      apiKey: context.module.secrets['openai_api_key'],
    }

    try {
      const { success, choice } = await makeCompletion(body, {
        projectId,
        spell: currentSpell,
        nodeId: node.id,
      })

      if (!success) return console.error('Error in generator')

      const raw = choice.text
      const result = raw
        // trim any newlines from the beginning and end
        .replace(/^\n+|\n+$/g, '')
        // trim any spaces from the beginning and end
        .replace(/^\s+|\s+$/g, '')
      const composed = `${prompt} ${result}`

      return {
        result,
        composed,
      }
    } catch (err) {
      console.error('Error in Generator component.' + err)
    }
  }
}
