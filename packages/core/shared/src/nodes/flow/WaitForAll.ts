// DOCUMENTED
import Rete from 'shared/rete'

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

    this.common = true
  }

  // Add documentation for node
  node = {}
  allTriggerFired = false
  runningCounter = 0

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
      tooltip: 'Add socket triggers',
    })

    node.inspector.add(inputGenerator)

    const defaultOutput = new Rete.Output('default', 'Output', triggerSocket)

    node.addOutput(defaultOutput)

    return node
  }

  waitForAll(): Promise<void> {
    return new Promise<void>(resolve => {
      const interval = setInterval(() => {
        if (this.allTriggerFired) {
          clearInterval(interval)
          resolve()
        }
      }, 50)
    })
  }

  /**
   * The worker contains the main business logic of the node.
   * It will pass those results to the outputs to be consumed by any connected components.
   * @param _node - The worker data.
   * @param inputs - Inputs of the worker.
   */
  async worker(_node: WorkerData, inputs: MagickWorkerInputs): Promise<void> {
    const nodeInputs = Object.keys(_node.inputs).filter(
      input => !!input
    ) as Array<any>
    ++this.runningCounter
    if (nodeInputs.length > this.runningCounter) {
      await this.waitForAll()
    } else {
      this.allTriggerFired = true
    }

    this.allTriggerFired = false
    this.runningCounter = 0
  }
}
