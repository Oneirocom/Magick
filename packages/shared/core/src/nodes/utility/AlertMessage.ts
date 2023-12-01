// DOCUMENTED
import * as Rete from 'shared/rete' // Use `* as` for consistent import style
import * as _ from 'lodash' // Use `* as` for consistent import style
import { TextInputControl } from '../../dataControls/TextInputControl'
import { MagickComponent } from '../../engine'
import { triggerSocket } from '../../sockets'
import { MagickNode, WorkerData } from '../../types'

/**
 * Alert component class extends MagickComponent<void>.
 *
 * When the alert component is triggered, it will fire an alert with the message in the input box.
 */
export class Alert extends MagickComponent<void> {
  constructor() {
    /**
     * Name of the component is 'Alert', which has no outputs,
     * categorized in 'Utility' and shows information about the component.
     */
    super(
      'Alert',
      { outputs: {} },
      'Utility',
      `When the alert component is triggered, it will fire an alert with the message in the input box.`
    )
  }

  /**
   * The builder is used to "assemble" the node component.
   *
   * @param node - MagickNode object
   * @returns MagickNode object with input and control
   */
  builder(node: MagickNode): MagickNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    // Set text value with the node's data text if node's data text is string type
    const value =
      typeof node.data.text === 'string' ? node.data.text : 'Input text here'

    const input = new TextInputControl({
      editor: this.editor,
      key: 'text',
      value,
    })

    // Return MagickNode with input and control
    return node.addInput(dataInput).addControl(input)
  }

  /**
   * The worker contains the main business logic of the node. It will pass those results
   * to the outputs to be consumed by any connected components.
   *
   * @param node - Object with input and destination data of the node
   */
  worker(node: WorkerData) {
    // Text value from the node, if node has no text value returns 'node has no data: ${JSON.stringify(node)}'
    const text = _.get(
      node,
      'data.text',
      `node has no data: ${JSON.stringify(node)}`
    )

    // Use window alert to show the text as alert
    alert(text)
  }
}
