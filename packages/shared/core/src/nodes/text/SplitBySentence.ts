// DOCUMENTED
/**
 * Split a long body of text into multiple strings, each of which is no longer than the specified length.
 * @category Text
 */
import Rete from 'shared/rete'
import { split } from 'sentence-splitter'

import { MagickComponent } from '../../engine'
import { arraySocket, stringSocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'
import { NumberControl } from '../../dataControls/NumberControl'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: string[]
}

const info =
  'Split a long body of text into multiple strings, each of which is no longer than the specified length.'

function splitStringIntoSentences(input: string, maxLength: number): string[] {
  // split the string into sentences
  const sentences = split(input)

  // array to hold the resulting strings
  const strings: string[] = []

  sentences.forEach(sentence => {
    // convert sentence object to string
    // @ts-ignore
    let sentenceStr = sentence.filter(token => token.type === 'Sentence')

    // if the sentence length is less than the maxLength, add it to the strings array
    if (sentenceStr.length <= maxLength) {
      strings.push(sentenceStr)
    } else {
      // if the sentence length is greater than maxLength, split it into multiple strings
      while (sentenceStr.length > maxLength) {
        // add a substring of maxLength to the strings array
        strings.push(sentenceStr.substr(0, maxLength))
        // remove the added substring from the sentence
        sentenceStr = sentenceStr.substr(maxLength)
      }
      // add the remaining part of the sentence to the strings array
      if (sentenceStr.length > 0) {
        strings.push(sentenceStr)
      }
    }
  })

  // return the array of strings
  return strings
}

/**
 * Split a long body of text into multiple strings, each of which is no longer than the specified length.
 * @category Text
 */
export class SplitBySentence extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Split By Sentence',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Text',
      info
    )
  }

  /**
   * The builder function for the SplitBySentence node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', arraySocket)

    const stringMaxLength = new NumberControl({
      dataKey: 'stringMaxLength',
      name: 'Maximum String Length',
      defaultValue: 280,
      tooltip: 'Enter The maximum length of each string.',
    })

    node.inspector.add(stringMaxLength)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * The worker function for the SplitBySentence node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the same string as the input.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
    const input = inputs.string[0] as string
    const stringMaxLength = node.data.stringMaxLength as number

    return {
      output: splitStringIntoSentences(input, stringMaxLength),
    }
  }
}
