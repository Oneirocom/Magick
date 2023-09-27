// DOCUMENTED
/**
 * A simple rete component that is paired with AgentExectuor to list the text channels in the guild
 * @category Discord
 */

import Rete from 'shared/rete'
import {
  Event,
  MagickComponent,
  triggerSocket,
  eventSocket,
  MagickNode,
  WorkerData,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  stringSocket,
} from 'shared/core'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: string
}

/**
 * Gets the List of all text channels in a server
 * @category Discord
 * @remarks Must be paired with AgentExecutor.
 */
export class DiscordListTextChannels extends MagickComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super(
      'Discord Text Channels',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Integrations/Discord',
      'Gets the List of All text channels in a server'
    )
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'Array', stringSocket)
    const event = new Rete.Input('event', 'Event', eventSocket, true)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
      .addInput(event)
  }

  /**
   * The worker function for the Discord List Text Channels node.
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
  ): Promise<WorkerReturn> {
    const { agent, data } = context
    if (!agent || !agent?.discord) {
      console.warn(
        'sending default information since there is no agent available'
      )
      return {
        output: 'General',
      }
    }

    const event = // event data is inside a task?
      ((inputs.event?.[0] as any)?.eventData ||
        // event data is coming from the event socket?
        inputs.event?.[0] ||
        // otherwise, get the input data from context
        (Object.values(data)[0] as any)?.eventData ||
        Object.values(data)[0]) as Event

    const discordClient = agent.discord.client

    const channel = event.channel

    const fetchedChannel = await discordClient.channels.fetch(channel)

    const name = fetchedChannel.name

    return { output: name }
  }
}
