// DOCUMENTED
import Rete from 'shared/rete'
import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { arraySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

const info =
  'Extract the value of one key in an array into a new array of the values.'

type WorkerReturn = {
  output: unknown[]
}

/**
 * ExtractFromArray component class for remapping an input array.
 * @extends MagickComponent
 */
export class ExtractFromArray extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * ExtractFromArray constructor.
   */
  constructor() {
    super(
      'Extract From Array',
      { outputs: { output: 'output', trigger: 'option' } },
      'Data/Arrays',
      info
    )
  }

  /**
   * Builder function for the ExtractFromArray node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - The built node.
   */
  builder(node: MagickNode): MagickNode {
    const inp = new Rete.Input('input', 'Input', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Output', arraySocket)

    const values = new InputControl({
      dataKey: 'value',
      name: 'Value to Extract',
      tooltip: 'This is a tooltip for value',
    })

    node.inspector.add(values)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * Worker function for the ExtractFromArray component.
   * @param {WorkerData} node - Node data.
   * @param {MagickWorkerInputs} inputs - Node inputs.
   * @param {MagickWorkerOutputs} _outputs - Node outputs.
   * @returns {Promise<WorkerReturn>} - A promise resolving to an object containing the new output.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs
  ): Promise<WorkerReturn> {
    const input = inputs.input[0] as Record<string, unknown>

    // get values
    const value = (node.data.value as string).trim()

    if (!input) return { output: [] }

    if (!Array.isArray(input)) return { output: [] }

    return {
      output: input.map(obj => {
        return obj[value]
      }),
    }
  }
}
