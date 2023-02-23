import Handlebars from 'handlebars'
import Rete from 'rete'
import {
  NodeData,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
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

export class PromptTemplate extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Prompt Template')
    this.task = {
      outputs: {
        prompt: 'output',
        trigger: 'option',
      },
    }
    this.category = 'Strings'
    this.runFromCache = true
    this.info = info
    this.display = false
  }

  builder(node: MagickNode) {
    const dataIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const prompt = new Rete.Output('prompt', 'Prompt', stringSocket)
    node
      .addInput(dataIn)
      .addOutput(dataOut)
      .addOutput(prompt)

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

    return node
  }

  async worker(
    node: NodeData,
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
