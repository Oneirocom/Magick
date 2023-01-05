import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { MultiSocketGeneratorControl } from '../../dataControls/MultiSocketGenerator'
import { anySocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../magick-component'

const info = `Fires once all connected triggers have fired.`

export class ExclusiveGate extends ThothComponent<void> {
  constructor() {
    // Name of the component
    super('Exclusive Gate')

    this.task = {
      runOneInput: true,
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }
    this.category = 'Logic'
    this.info = info
    this.display = true
  }

  node = {}

  builder(node: ThothNode) {
    const multiInputGenerator = new MultiSocketGeneratorControl({
      connectionType: 'input',
      socketTypes: ['anySocket', 'triggerSocket'],
      taskTypes: ['output', 'option'],
      name: 'Triggers',
    })

    node.inspector.add(multiInputGenerator)

    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const dataOutput = new Rete.Output('output', 'Output', anySocket)

    node.addOutput(dataOutput).addOutput(triggerOutput)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    _outputs: ThothWorkerOutputs,
    context: { silent: boolean; socketInfo: { targetSocket: any } }
  ) {
    const trigger = context.socketInfo.targetSocket

    console.log('context', context)

    const silent = context.silent
    //remove ' trigger' from the end of the name
    const triggerFilterName = trigger?.replace('trigger', '')

    const nodeInputs = Object.entries(inputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    console.log('Node inputs', nodeInputs)

    // get the first input from the nodeInputs object where the key includes triggerFilterName
    const outputKey = Object.keys(nodeInputs).find(key =>
      key.includes(triggerFilterName)
    )

    if (!silent)
      node.display(
        'triggerFilterName: ' + triggerFilterName + ' | ' + outputKey ?? 'error'
      )

    if (!outputKey) return { output: 'error' }

    const output = nodeInputs[outputKey]

    console.log('outputKey', outputKey, 'output', output)

    return {
      output,
    }
  }
}
