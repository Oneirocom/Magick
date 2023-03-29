import Rete from 'rete'

import { MultiSocketGeneratorControl } from '../../dataControls/MultiSocketGenerator'
import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData
} from '../../types'

const info = `Fires once all connected triggers have fired.`

export class ExclusiveGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super('Exclusive Gate', {
      runOneInput: true,
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }, 'Flow', info)

  }

  node = {}

  builder(node: MagickNode) {
    const multiInputGenerator = new MultiSocketGeneratorControl({
      connectionType: 'input',
      socketTypes: ['triggerSocket', 'anySocket'],
      taskTypes: ['option', 'output'],
      name: 'Triggers',
    })

    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const dataOutput = new Rete.Output('output', 'Output', anySocket)

    node.addOutput(triggerOutput).addOutput(dataOutput)

    node.inspector.add(multiInputGenerator)

    return node
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: { socketInfo: { targetSocket: string } }
  ) {
    const trigger = context.socketInfo.targetSocket

    const triggerFilterName = trigger?.replace('trigger', '')

    const nodeInputs = Object.entries(inputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    // get the first input from the nodeInputs object where the key includes triggerFilterName
    const outputKey = Object.keys(nodeInputs).find(key =>
      key.includes(triggerFilterName)
    )

    if (!outputKey) return { output: 'error' }

    const output = nodeInputs[outputKey]

    return {
      output,
    }
  }
}
