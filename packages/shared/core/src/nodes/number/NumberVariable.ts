// DOCUMENTED
import Rete from 'shared/rete'

import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { MagickComponent } from '../../engine'
import { numberSocket } from '../../sockets'
import { MagickNode, WorkerData } from '../../types'

/** Component information */
const info = 'Outputs a Number specified in the Value property.'

/** Output data type */
type InputReturn = {
  output: number
}

/**
 * Represents a Number Variable Component
 */
export class NumberVariable extends MagickComponent<InputReturn> {
  /**
   * Constructs a new NumberVariable instance
   */
  constructor() {
    super(
      'Number Variable',
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
   * Builds the component node
   * @param node - The MagickNode instance
   * @returns The updated node with output
   */
  builder(node: MagickNode): MagickNode {
    const out = new Rete.Output('output', 'output', numberSocket)
    const _var = new NumberControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
      tooltip: 'Value for variable number',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
      tooltip: 'Name for variable number',
    })

    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
      tooltip: 'Switch isPublic',
    })

    node.inspector.add(name).add(_var).add(_public)

    return node.addOutput(out)
  }

  /**
   * Component worker implementation
   * @param node - The WorkerData instance
   * @param _inputs - The component inputs
   * @param _outputs - The component outputs
   * @param context - The working context
   * @returns The output variables
   */
  worker(
    node: WorkerData,
    _inputs: unknown,
    _outputs: unknown,
    context: { module: { publicVariables: string } }
  ): InputReturn {
    let _var = node?.data?._var as number

    let publicVars = context.module.publicVariables as {}

    // if publicVars is a string, parse it into json
    if (typeof publicVars === 'string') {
      publicVars = JSON.parse(publicVars)
    }

    if (node?.data?.isPublic && publicVars[node.id]) {
      _var = publicVars[node.id].value
    }

    return {
      output: +_var,
    }
  }
}
