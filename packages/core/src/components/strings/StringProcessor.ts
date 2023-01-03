import Rete from 'rete'

import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types'
import { CodeControl } from '../../dataControls/CodeControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
const info = `The String Processor component takes a string as an input and allows you to write a function in the text editor to parse that string in whatever way you need.  You can define any number of outputs which you can pass the result of your parsing out through.

Note that the return value of your function must be an object whose keys match the names of your generated output sockets.`

export class StringProcessor extends ThothComponent<Record<string, string>> {
  constructor() {
    // Name of the component
    super('String Processor')

    this.task = {
      outputs: { trigger: 'option' },
      init: () => {},
    }
    this.category = 'Strings'
    this.info = info
  }

  node = {}

  builder(node: ThothNode) {
    // Add a default javascript template if the node is new and we don't have one.
    if (!node.data.code)
      node.data.code =
        '(inputStr) => {\n    return { "outputKey": "outputValue" }\n}'

    // Rete controls
    const input = new Rete.Input('input', 'Input', stringSocket)
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)

    // Inspector controls
    const outputGenerator = new SocketGeneratorControl({
      socketType: 'stringSocket',
      connectionType: 'output',
      ignored: ['trigger'],
      name: 'Output Sockets',
    })

    const codeControl = new CodeControl({
      dataKey: 'code',
      name: 'code',
    })

    node.inspector.add(outputGenerator)
    node.inspector.add(codeControl)

    return node.addInput(input).addInput(triggerIn).addOutput(triggerOut)
  }

  worker(node: NodeData, inputs: ThothWorkerInputs) {
    const input = inputs['input'][0]

    // TODO (mitchg) - obviously this is bad, but we want this for games week. Figure out security later.
    const code = node.data.code as string
    // eslint-disable-next-line
    const stringProcessor = eval(code)
    const outputs = stringProcessor(input)

    // Note: outputGenerator lower-cases the output connection name,
    // but end-users shouldn't be aware of this.  When they write
    // their javascript snippet, it should return a dict with the keys
    // they typed in, then we lower-case the keys for them.
    const lowerCasedOutputs = Object.keys(outputs).reduce((prev, key) => {
      return { ...prev, [key]: outputs[key] }
    }, {})

    return lowerCasedOutputs
  }
}
