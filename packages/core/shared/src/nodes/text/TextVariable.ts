// DOCUMENTED
/**
 * Module represents a Rete flow based on Google code standards.
 * @module
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'shared/rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { anySocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * The text representing the TextVariable class.
 */
const info = `Outputs a string specified in the text editor. Allows multi-line text (in contrast to the string variable which only allows a single line).`

/**
 * The expected output of TextVariable class method builder.
 */
type InputReturn = {
  output: string
}

/**
 * Class representing the TextVariable node, inheriting from MagickComponent class.
 */
export class TextVariable extends MagickComponent<InputReturn> {
  /**
   * Create a TextVariable.
   */
  constructor() {
    super(
      'Text Variable',
      {
        outputs: {
          output: 'output',
        },
      },
      'Data/Variables',
      info
    )
  }

  /**
   * Function to build a node of the TextVariable class.
   * @param {MagickNode} node - The representation of the node.
   * @returns {Rete.Output} - The output of the node.
   */
  builder(node: MagickNode) {
    if (!node.data.fewshot) node.data.fewshot = ''
    const out = new Rete.Output('output', 'output', anySocket)

    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
      tooltip: 'Enter name',
    })

    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
      tooltip: 'Switch isPublic',
    })

    const fewshotControl = new FewshotControl({ tooltip: 'Open fewshot' })

    node.inspector.add(fewshotControl).add(name).add(_public)

    return node.addOutput(out)
  }

  /**
   * Function to operate a node of the TextVariable class.
   * @param {WorkerData} node - The current state of the node representing the operation to be
   * performed.
   * @param {MagickWorkerInputs} _inputs - The inputs of the node. In this case, this object is
   * not used.
   * @param {MagickWorkerOutputs} outputs - The possible outputs of the node.
   * @param {Object} context - The data passed to the worker and the module.
   * @returns {InputReturn} - The outputs of the node. In this case, an object with the output
   * string.
   */
  worker(
    node: WorkerData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: { module: { publicVariables: string } }
  ) {
    let text = node.data.fewshot as string

    let publicVars = context.module.publicVariables as {}

    // if publicVars is a string, parse it into json
    if (typeof publicVars === 'string') {
      publicVars = JSON.parse(publicVars)
    }

    if (node?.data?.isPublic && publicVars[node.id]) {
      text = publicVars[node.id].value
    }
    return {
      output: text,
    }
  }
}
