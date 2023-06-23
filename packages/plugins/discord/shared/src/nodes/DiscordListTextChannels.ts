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
  arraySocket,
} from '@magickml/core'
import { ChannelType } from '../types/ChannelType'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: {
    id: string,
    name: string,
  }[]
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
      'Discord',
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
    const outp = new Rete.Output('output', 'Array', arraySocket)
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
    if (!agent) {
      throw new Error('Agent not found')
    }
    if (!agent?.discord) {
      throw new Error('Discord connector not found on agent, is Discord initialized?')
    }

    const event = // event data is inside a task?
      ((inputs.event?.[0] as any)?.eventData ||
        // event data is coming from the event socket?
        inputs.event?.[0] ||
        // otherwise, get the input data from context
        (Object.values(data)[0] as any)?.eventData ||
        Object.values(data)[0]) as Event

    // discordClient is a Discord.js client instance
    const discordClient = agent.discord.client

    const channel = event.channel // channel in which the message was sent

    // fetch the channel using its ID
    const fetchedChannel = await discordClient.channels.fetch(channel);

    if (!fetchedChannel) {
      throw new Error('Channel not found')
    }

    if (fetchedChannel.type !== ChannelType.GuildText) {
      throw new Error('Event channel must be a text channel')
    }

    // get the guild object from the fetched channel
    const guild = fetchedChannel.guild;

    // get the list of text channels
    const textChannels = guild.channels.cache.filter(ch => ch.type === ChannelType.GuildText);

    // return the list of text channels as an array
    const textChannelArray = textChannels.map(channel => ({
      id: channel.id,
      name: channel.name,
    }));

    return { output: textChannelArray };
  }
}
