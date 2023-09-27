// DOCUMENTED
import Rete from 'shared/rete'

import { MultiSocketGeneratorControl } from '../../dataControls/MultiSocketGenerator'
import { MagickComponent } from '../../engine'
import { anySocket, triggerSocket } from '../../sockets'
import {
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  WorkerData,
} from '../../types'

/** Fires once all connected triggers have fired */
const info =
  'Allows you to create multiple input triggers and data nodes but outputs only the first one that gets triggered.'

/**
 * Exclusive Gate Component
 */
export class ExclusiveGate extends MagickComponent<void> {
  constructor() {
    // Name of the component
    super(
      'Exclusive Gate',
      {
        runOneInput: true,
        outputs: {
          trigger: 'option',
          output: 'output',
        },
      },
      'Flow',
      info
    )

    this.common = true
  }

  /**
   * Build the node
   * @param node - magick node
   * @returns Rete.Node
   */
  builder(node: MagickNode) {
    const multiInputGenerator = new MultiSocketGeneratorControl({
      connectionType: 'input',
      socketTypes: ['triggerSocket', 'anySocket'],
      taskTypes: ['option', 'output'],
      name: 'Triggers',
      tooltip: 'Add socket triggers',
    })

    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const dataOutput = new Rete.Output('output', 'Output', anySocket)

    node.addOutput(triggerOutput).addOutput(dataOutput)

    node.inspector.add(multiInputGenerator)

    return node
  }

  /**
   * The worker contains the main business logic of the node.
   * It will pass those results to the outputs to be consumed by any connected components.
   * @param node - worker data
   * @param inputs - magick worker inputs
   * @param _outputs - magick worker outputs
   * @param context - context object
   */
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

    // Get the first input from the nodeInputs object where the key includes triggerFilterName.
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
