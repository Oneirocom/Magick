/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import similarity from 'similarity'

import { NodeData, MagickNode, MagickWorkerInputs } from '../../types'
import { InputControl } from '../../dataControls/InputControl'
import { anySocket, stringSocket, triggerSocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'

const info = 'SentenceMatcher takes an query, needs to be generalized'

type InputReturn = {
  output: unknown
}

export class SentenceMatcher extends MagickComponent<Promise<InputReturn>> {
  constructor() {
    super('Sentence Matcher')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: MagickNode) {
    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    node.inspector.add(nameControl)
    const sentences = new Rete.Input('sentences', 'Sentences', anySocket, true)
    const source = new Rete.Input('source', 'Source', anySocket, true)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
      .addInput(sentences)
      .addInput(source)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    { silent }: { silent: boolean }
  ) {
    const sourceSentence = (inputs['source'][0] ?? inputs['source']) as string
    const sentences = (inputs['sentences'][0] ??
      inputs['sentences']) as string[]

    console.log('source setences is', sourceSentence)
    console.log('sentences are', sentences)

    node.display('Processing')

    let bestScore = 0
    let bestSentence = ''

    for (const sentence in sentences) {
      const score = similarity(sourceSentence, sentences[sentence])
      if (score > bestScore) {
        console.log('score is', score, sentences[sentence])
        bestScore = score
        bestSentence = sentences[sentence]
      }
    }

    node.display(
      'Best Score is: ' + bestScore + ' | Top label is ' + bestSentence
    )
    return { output: bestSentence }
  }
}
