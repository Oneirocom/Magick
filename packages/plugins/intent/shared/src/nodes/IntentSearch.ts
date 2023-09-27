// DOCUMENTED
/**
 * A component to process Intent Search.
 * @category Intent
 */
import Rete from 'shared/rete'
import { InputControl } from '@magickml/core'
import {
  MagickComponent,
  numberSocket,
  stringSocket,
  embeddingSocket,
  triggerSocket,
  MagickNode,
  MagickWorkerInputs,
  ModuleContext,
  WorkerData,
  MagickWorkerOutputs,
} from '@magickml/core'

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
      'AI/Intent',
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
    const embeddingInput = new Rete.Input(
      'embedding',
      'embedding',
      embeddingSocket,
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
      .addInput(embeddingInput)
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
    const { projectId } = context
    const { app } = context.module
    if (!app) throw new Error('App not found in context')

    const threshold =
      (inputs['threshold'] && (inputs['threshold'][0] as number)) ??
      (node.data.threshold as number)

    let embedding = (
      inputs['embedding'] ? inputs['embedding'][0] : null
    ) as number[]

    if (typeof embedding == 'string')
      embedding = (embedding as string)
        .replace('[', '')
        .replace(']', '')
        .split(',')
        .map(parseFloat)

    const metadata = { intent: { type: 'story' } }
    const response = await app.service('documents').find({
      query: {
        projectId,
        $limit: 1,
        embedding,
        metadata,
      },
    })

    let intent = ''
    let document: any = null
    if (Array.isArray(response.data) && response.data.length > 0) {
      document = response.data[0]
      const distance = document ? document?.distance : null
      if (distance != null && distance < threshold) {
        intent = document?.metadata?.intent?.name ?? ''
      }
    }

    return {
      output: intent,
    }
  }
}
