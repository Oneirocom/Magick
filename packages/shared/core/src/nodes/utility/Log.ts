// DOCUMENTED
/**
 * Logs a value to the console.
 */
import Rete from 'shared/rete'

import { InputControl } from '../../dataControls/InputControl'
import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import { MagickNode, MagickWorkerInputs, WorkerData } from '../../types'

const info =
  'Takes an input string message and logs the message to the console.'

/**
 * Log component class.
 * @class
 */
export class Log extends MagickComponent<void> {
  /**
   * Create a new Log component.
   * @constructor
   */
  constructor() {
    super(
      'Log',
      {
        outputs: {},
      },
      'Utility',
      info
    )
  }

  /**
   * Build the Log component.
   * @param node - The node to add inputs to.
   * @returns The node with inputs added.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'Value', anySocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Log Name',
      tooltip: 'Enter Log Name',
    })

    node.inspector.add(nameControl)

    return node.addInput(dataInput).addInput(inp)
  }

  /**
   * Log the input value and output null.
   * @param node - The node to log from.
   * @param inputs - The inputs to log.
   * @returns null.
   */
  async worker(node: WorkerData, inputs: MagickWorkerInputs) {
    const input = inputs.string[0] as string

    console.log(`Output from ${node.data.name || 'log component'}`, input)

    return null
  }
}
