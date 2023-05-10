// DOCUMENTED
import Rete from 'rete'
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { booleanSocket } from '../../sockets'
import { MagickComponent } from '../../engine'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/**
 * Informational text regarding the boolean data type.
 */
const info = `Outputs a boolean value based on its Value property.`

interface InputReturn {
  /**
   * Output data containing a boolean.
   */
  output: boolean
}

/**
 * Represents a Rete component of the BooleanVariable class.
 */
export class BooleanVariable extends MagickComponent<InputReturn> {
  constructor() {
    super(
      'Boolean Variable',
      {
        outputs: {
          output: 'output',
        },
      },
      'Boolean',
      info
    )
  }

  /**
   * Builds the node based on the input parameters.
   * @param node - The node to be built.
   * @returns The node, after the output has been added to it.
   */
  builder(node: MagickNode): MagickNode {
    const out = new Rete.Output('output', 'output', booleanSocket)
    const _var = new BooleanControl({
      dataKey: '_var',
      name: 'Value',
      icon: 'moon',
      component: 'switch',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })
    const _public = new BooleanControl({
      dataKey: 'isPublic',
      name: 'isPublic',
    })

    node.inspector.add(name).add(_var).add(_public)

    return node.addOutput(out)
  }

  /**
   * The worker function for the BooleanVariable class.
   * @param node - The worker node to be used.
   * @param inputs - The input parameters to be used by the worker.
   * @param outputs - The outptut parameters to be used by the worker.
   * @param context - The context object to be used by the worker.
   * @returns - Output data consisting of a boolean.
   */
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    context: { module: { publicVariables: string } }
  ): InputReturn {
    let _var = node?.data?._var === true
    const publicVars = JSON.parse(context.module.publicVariables)
    if (node?.data?.isPublic && publicVars[node.id]) {
      _var = publicVars[node.id].value
    }

    return {
      output: _var,
    }
  }
}
