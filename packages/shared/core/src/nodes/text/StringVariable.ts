// DOCUMENTED
import Rete from 'shared/rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { stringSocket } from '../../sockets'
import { MagickNode, WorkerData } from '../../types'

/** Information about the string variable */
const info = 'Outputs the string specified in the Value property.'

/** Typed interface for worker function return data */
interface InputReturn {
  output: string
}

/**
 * StringVariable class represents a string variable in the node editor.
 * @extends MagickComponent<InputReturn>
 */
export class StringVariable extends MagickComponent<InputReturn> {
  /**
   * Constructs the StringVariable object
   */
  constructor() {
    super(
      'String Variable',
      {
        outputs: {
          output: 'output',
        },
      },
      'Data/Variables',
      info
    )

    this.common = true
  }

  /**
   * Builds the node with Rete
   * @param {MagickNode} node - The node to build
   * @returns {MagickNode} - The same node, returned for chaining
   */
  builder(node: MagickNode): MagickNode {
    const out = new Rete.Output('output', 'output', stringSocket)
    const _var = new InputControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
      tooltip: 'Enter value',
    })
    const nameControl = new InputControl({
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

    node.inspector.add(nameControl).add(_var).add(_public)

    return node.addOutput(out)
  }

  /**
   * Worker function that processes the data during run time
   * @param {WorkerData} node - The node containing the data
   * @param _inputs - Unused, preserved for compatibility
   * @param _outputs - Unused, preserved for compatibility
   * @param {object} context - The context object containing module's public variables
   * @returns {InputReturn} - The output of the node
   */
  worker(
    node: WorkerData,
    _inputs: unknown,
    _outputs: unknown,
    context: { module: { publicVariables: string } }
  ): InputReturn {
    let _var = node?.data?._var as string
    let publicVars = context.module.publicVariables as {}

    // if publicVars is a string, parse it into json
    if (typeof publicVars === 'string') {
      publicVars = JSON.parse(publicVars)
    }

    if (node?.data?.isPublic && publicVars[node.id]) {
      _var = publicVars[node.id].value
    }

    return {
      output: _var,
    }
  }
}
