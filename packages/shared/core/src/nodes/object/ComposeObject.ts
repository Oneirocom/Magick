// DOCUMENTED
import Rete from 'shared/rete'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { objectSocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/** The information text for the ComposeObject component */
const info =
  'Takes any number of variable inputs and composes a single output object using the input names as the property keys and the values passed into them.'

/** The data type for the worker function return value */
type WorkerReturn = {
  output: Record<string, unknown>
}

/**
 * ComposeObject component for creating an object from inputs.
 * @extends {MagickComponent<Promise<WorkerReturn>>}
 */
export class ComposeObject extends MagickComponent<Promise<WorkerReturn>> {
  /**
   * Constructor for ComposeObject component.
   */
  constructor() {
    super(
      'Compose Object',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Data/Data Structures',
      info
    )
  }

  /**
   * Builds the ComposeObject node with inputs, outputs and controls.
   * @param {MagickNode} node
   * @returns {MagickNode} The built node.
   */
  builder(node: MagickNode): MagickNode {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Object', objectSocket)

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
      tooltip: 'Add input sockets',
    })

    node.addInput(dataInput).addOutput(dataOutput).addOutput(outp)

    node.inspector.add(inputGenerator)

    return node
  }

  /**
   * Worker function for the ComposeObject component.
   * @param {WorkerData} _node - Worker data object.
   * @param {MagickWorkerInputs} rawInputs - Raw input values.
   * @returns {Promise<WorkerReturn>} A promise resolving to the output object.
   */
  async worker(
    _node: WorkerData,
    rawInputs: MagickWorkerInputs
  ): Promise<WorkerReturn> {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const data: Record<string, unknown> = {}
    for (const x in inputs) {
      data[x] = inputs[x]
    }

    return {
      output: data,
    }
  }
}
