// DOCUMENTED
import Rete from 'shared/rete'
import { v4 as uuidv4 } from 'uuid'

import { MagickComponent } from '../../engine'
import { pluginManager } from '../../plugin'
import { anySocket, eventSocket, triggerSocket } from '../../sockets'
import {
  Event,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  WorkerData,
} from '../../types'

/** Component info text */
const info = `The respond component will call the response handler.`

/**
 * Respond component
 */
export class Respond extends MagickComponent<void> {
  /**
   * Constructor for Respond component
   */
  constructor() {
    super(
      'Respond',
      {
        runOneInput: true,
        outputs: {
          trigger: 'option',
        },
      },
      'IO',
      info
    )
  }

  /**
   * Builder for Output component
   * @param node - MagickNode instance
   * @returns MagickNode instance with configured inputs and outputs
   */
  builder(node: MagickNode): MagickNode {
    const triggerInput = new Rete.Input(
      'trigger',
      'Trigger',
      triggerSocket,
      true
    )
    const triggerOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const textInput = new Rete.Input('input', 'Outputs', anySocket, true)
    const event = new Rete.Input('event', 'Event Override', eventSocket)

    node.data.sendToPlaytest = true

    // need to automate this part! Won't work without a socket key
    node.data.socketKey = node?.data?.socketKey || uuidv4()

    return node
      .addInput(triggerInput)
      .addInput(textInput)
      .addInput(event)
      .addOutput(triggerOutput)
  }

  /**
   * Worker function for Output component
   * @param node - WorkerData object
   * @param inputs - MagicWorkerInputs object
   * @param _outputs - MagicWorkerOutputs object
   * @param context - Module and EditorContext instances
   * @returns output data
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<{ output: string }> {
    if (!inputs.input) {
      console.error('No input provided to output component')
      return { output: '' }
    }
    const { agent, data } = context
    const event = // event data is inside a task
      ((inputs.event?.[0] as any)?.eventData ||
        // event data is coming from the event socket
        inputs.event?.[0] ||
        // get the input data from context
        (Object.values(data)[0] as any)?.eventData ||
        Object.values(data)[0]) as Event

    const output = inputs.input.filter(Boolean)[0] as string

    if (agent) {
      const type = pluginManager.getInputTypes().find(type => {
        return type.name.includes(
          (event.connector as any).replace('Input - ', '')
        )
      })

      const responseOutputType = type?.defaultResponseOutput
      const out = agent.outputTypes.find(t => t.name === responseOutputType)

      if (out && out.handler) {
        out.handler({
          output,
          agent,
          event,
        })
      } else {
        console.warn('*** WARNING: No handler found')
      }
    } else {
      console.warn('*** WARNING: No agent found')
    }

    return {
      output,
    }
  }
}
