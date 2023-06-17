// DOCUMENTED
/**
 * A simple rete component that is paired with AgentExectuor to list the text channels in the guild
 * @category Discord
 */

import Rete from 'rete'
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
} from '@magickml/core'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: string | number
}

/**
 * Gets the List of all text channels in a server
 * @category Discord
 * @remarks Must be paired with AgentExecutor.
 */
export class DiscordVoiceChannelForSender extends MagickComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super(
      'Get Voice Channel For Sender',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Discord',
      'Gets the current voice channel of the message sender'
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
    const outp = new Rete.Output('output', 'Channel ID', stringSocket)
    const event = new Rete.Input('event', 'Event', eventSocket, true)

    return node.addInput(dataInput).addOutput(dataOutput).addOutput(outp).addInput(event)
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
      console.warn('sending default information since there is no agent available')
      return {
        output: 1051457146388217900
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

    // get the username of the message sender
    const username = event.sender
    
    // get the current voice channel of the message sender
    const channel = discordClient.users.cache.find(user => user.username === username).voice?.channel

    const fetchedChannel = await discordClient.channels.fetch(channel);

    const id = fetchedChannel.id;

    return { output: id };
  }
}
