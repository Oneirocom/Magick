import Handlebars from 'handlebars'
import Rete from 'rete'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode, MagickWorkerInputs, MagickWorkerOutputs,
  WorkerData
} from '../../types'

const info = `The text template component is useful for composing text objects or templated strings.  You can define any number of inputs, and utilize those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your graph.

Controls have also been added which give you control of some of the fundamental settings of the completion endpoint, including temperature, max tokens, and your stop sequence.

The component has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. `

type WorkerReturn = {
  prompt: string
}

export class TextTemplate extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Text Template', {
      outputs: {
        prompt: 'output',
        trigger: 'option',
      },
    }, 'Text', info)
    
    this.runFromCache = true
    this.display = false
  }

  builder(node: MagickNode) {
    const dataIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const prompt = new Rete.Output('prompt', 'Prompt', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
    })

    const fewshotControl = new FewshotControl({
      name: 'Prompt Template',
      language: 'handlebars',
    })

    node.inspector
      .add(inputGenerator)
      .add(fewshotControl)

    node
      .addInput(dataIn)
      .addOutput(dataOut)
      .addOutput(prompt)

    return node
  }
  async worker(
    node: WorkerData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
  ) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)
    
    // Replace carriage returns with newlines because that's what the language models expect
    const fewshot = node.data.fewshot
      ? (node.data.fewshot as string).replace('\r\n', '\n')
      : ''
   
    const template = Handlebars.compile(fewshot, { noEscape: true })
    const prompt = template(inputs)

    return {
      prompt,
    }
  }
}
