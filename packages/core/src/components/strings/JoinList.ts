import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types'
import { TextInputControl } from '../../controls/TextInputControl'
import { stringSocket, arraySocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
const info = `The Join List component takes in an array, and will join each item in the array together with a seperator, defined in the components input field.`

type WorkerReturn = {
  text: string
}

export class JoinListComponent extends ThothComponent<WorkerReturn> {
  constructor() {
    // Name of the component
    super('Join List')

    this.task = {
      outputs: {
        text: 'output',
        trigger: 'option',
      },
      init: () => {},
    }

    this.category = 'Strings'
    this.info = info
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('text', 'String', stringSocket)

    const inputList = new Rete.Input('list', 'List', arraySocket)

    // Handle default value if data is present
    const separator = node.data.separator
      ? (node.data.separator as string)
      : ' '

    // controls are the internals of the node itself
    // This default control sample has a text field.
    const input = new TextInputControl({
      editor: this.editor,
      key: 'separator',
      value: separator,
    })

    return node.addOutput(out).addControl(input).addInput(inputList)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: NodeData, inputs: ThothWorkerInputs & { list: [string][] }) {
    return {
      text: inputs.list[0].join(node.data.separator as string),
    }
  }
}
