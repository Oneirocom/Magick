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
  'Takes an input array and iterates through each object in the the array, creates a new object with only the matching keys from the Values property, and outputs an array of the new objects.'

type WorkerReturn = {
  output: unknown[]
}

/**
 * RemapArray component class for remapping an input array.
 * @extends MagickComponent
 */
export class RemapArray extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * RemapArray constructor.
   */
  constructor() {
    super(
      'Remap Array',
      { outputs: { output: 'output', trigger: 'option' } },
      'Data/Arrays',
      info
    )
  }

  /**
   * Builder function for the RemapArray node.
   * @param {MagickNode} node - The node to build.
   * @returns {MagickNode} - The built node.
   */
  builder(node: MagickNode): MagickNode {
    const inp = new Rete.Input('input', 'Input', arraySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Output', arraySocket)

    const values = new InputControl({
      dataKey: 'values',
      name: 'Values (, separated)',
      tooltip: 'this is an input for value',
    })

    node.inspector.add(values)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * Worker function for the RemapArray component.
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
    const values = (node.data.values as string).split(',').map(v => v.trim())

    if (!input) return { output: [] }

    if (!Array.isArray(input)) return { output: [] }

    return {
      output: input.map(obj => {
        const newObject: Record<string, unknown> = {}
        for (const key in obj) {
          if (values.includes(key)) {
            newObject[key] = obj[key]
          }
        }
        return newObject
      }),
    }
  }
}
