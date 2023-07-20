// DOCUMENTED
/**
 * A component to process Intent Search.
 * @category Intent
 */
import Rete from 'rete'
import { InputControl } from '@magickml/core'
import {
  MagickComponent,
  numberSocket,
  stringSocket,
  triggerSocket,
  MagickNode,
  MagickWorkerInputs,
  ModuleContext,
  WorkerData,
  objectSocket,
  MagickWorkerOutputs,
  getLogger,
} from '@magickml/core'

import axios from 'axios'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: string
}

/**
 * Returns the same output as the input.
 * @category Utility
 * @remarks This component is useful for testing purposes.
 */
export class IntentSearch extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Intent Search',
      {
        outputs: {
          output: 'output',
          object: 'object',
          trigger: 'option',
        },
      },
      'Intent',
      'Intent Search'
    )
  }

  /**
   * The builder function for the IntentSearch node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const thresholdInput = new Rete.Input(
      'threshold',
      'Threshold',
      numberSocket,
      false
    )

    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textOutput = new Rete.Output('output', 'String', stringSocket)

    const threshold = new InputControl({
      dataKey: 'threshold',
      name: 'Threshold',
      defaultValue: 0.5,
      tooltip: 'The similarity threshold allowed',
    })

    node.inspector.add(threshold)

    return node
      .addInput(thresholdInput)
      .addInput(triggerInput)
      .addOutput(triggerOutput)
      .addOutput(textOutput)
  }

  /**
   * The worker function for the IntentSearch node.
   * @param {WorkerData} node - The worker data.
   * @param {MagickWorkerInputs} inputs - Node inputs.
   * @param {MagickWorkerOutputs} _outputs - Node outputs.
   * @returns the intent
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const threshold =
      (inputs['threshold'] && (inputs['threshold'][0] as number)) ??
      (node.data.threshold as number)

    return {
      output: String(threshold),
    }
  }
}
