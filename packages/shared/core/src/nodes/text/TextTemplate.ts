// DOCUMENTED
import Handlebars from 'handlebars'
import Rete from 'shared/rete'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

const info = `Takes any number of named inputs and inserts them into a template defined in the text editor, then outputs the resulting string. The template you create must follow a templating language known as Handlebars. Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value from the input with the same name. This allows you to write almost any fewshot you might need, and input values from anywhere else in your graph.`

type WorkerReturn = {
  prompt: string
}

/**
 * TextTemplate component for generating templated text using Handlebars.
 *
 * @extends MagickComponent<Promise<WorkerReturn>>
 */
export class TextTemplate extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Text Template',
      {
        outputs: {
          prompt: 'output',
          trigger: 'option',
        },
      },
      'Data/Text',
      info
    )

    this.common = true

    // this.runFromCache = true;
  }

  /**
   * Build the text template node.
   *
   * @param {MagickNode} node - The node being built.
   * @returns {MagickNode} The updated node.
   */
  builder(node: MagickNode): MagickNode {
    const dataIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const prompt = new Rete.Output('prompt', 'Prompt', stringSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      ignored: ['trigger'],
      name: 'Input Sockets',
      tooltip: 'Add input sockets',
    })

    const fewshotControl = new FewshotControl({
      name: 'Prompt Template',
      language: 'handlebars',
      tooltip: 'Open prompt template',
    })

    node.inspector.add(inputGenerator).add(fewshotControl)

    node.addInput(dataIn).addOutput(dataOut).addOutput(prompt)

    return node
  }

  /**
   * Process the incoming data and generate the templated text.
   *
   * @param {WorkerData} node - The node being processed.
   * @param {MagickWorkerInputs} rawInputs - The incoming inputs.
   * @param {MagickWorkerOutputs} _outputs - The outputs.
   * @returns {Promise<WorkerReturn>} The processed text.
   */
  async worker(
    node: WorkerData,
    rawInputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
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
