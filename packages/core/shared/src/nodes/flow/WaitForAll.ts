// DOCUMENTED
import Rete from 'rete'

import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { MagickComponent } from '../../engine'
import { triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

/** Info for the WaitForAll Component */
const info = `Triggers the output once all connected inputs have been triggered.`

/**
 * WaitForAll is a component to ensure all connected triggers have fired.
 */
export class WaitForAll extends MagickComponent<void> {
  constructor() {
    // Name of the Component
    super(
      'Wait For All',
      {
        outputs: { default: 'option' },
      },
      'Flow',
      info
    )
  }

  // Add documentation for node
  node = {}

  /**
   * Sets up the node with input sockets and output connection.
   * @param node - The MagickNode to be built.
   * @returns MagickNode
   */
  builder(node: MagickNode): MagickNode {
    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      socketType: 'triggerSocket',
      name: 'Input Sockets',
    })

    node.inspector.add(inputGenerator)

    const defaultOutput = new Rete.Output('default', 'Output', triggerSocket)

    node.addOutput(defaultOutput)

    return node
  }

  /**
   * The worker contains the main business logic of the node.
   * It will pass those results to the outputs to be consumed by any connected components.
   * @param _node - The worker data.
   * @param inputs - Inputs of the worker.
   */
  worker(_node: WorkerData, inputs: MagickWorkerInputs): void {
    const nodeInputs = Object.values(inputs).filter(
      input => !!input
    ) as Array<any>
    // Close all outputs
    this._task.closed = [...nodeInputs.map(out => out.name)]
  }
}
