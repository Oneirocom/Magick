import Rete from 'rete'

import { NodeData, ThothNode } from '../../../types'
import { TextInputControl } from '../../controls/TextInputControl'
import { TaskOptions } from '../../plugins/taskPlugin/task'
import { triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = `When the alert component is triggered, it will fire an alert with the message in the input box.`

export class Alert extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('Alert')

    this.task = {
      outputs: {},
      init: () => {},
      onRun: () => {},
    } as TaskOptions
    this.category = 'Utility'
    this.info = info
  }
  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode): ThothNode {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)

    const value = node.data.text ? node.data.text : 'Input text here'

    const input = new TextInputControl({
      editor: this.editor,
      key: 'text',
      value,
    })

    return node.addInput(dataInput).addControl(input)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: NodeData) {
    alert(node.data.text)
  }
}
