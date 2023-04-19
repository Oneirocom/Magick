// DOCUMENTED
/**
 * A simple rete component that returns the same output as the input.
 * @category Utility
 */
import Rete from 'rete'

import {
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  ModuleContext,
  stringSocket,
  triggerSocket,
  WorkerData
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
export class DiscordListChannels extends MagickComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super(
      'Discord List Channels',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Discord' as any,
      'Gets the List of All channels in a server'
    )
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    return node
      .addInput(dataInput)
      .addInput(inp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /**
   * The worker function for the Echo node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the same string as the input.
   */
  async worker(
    node: WorkerData,
    inputs: MagickWorkerInputs,
    _outputs: MagickWorkerOutputs,
    context: ModuleContext
  ): Promise<WorkerReturn> {
    const { projectId } = context
    const { agent } = context.module
    //@ts-ignore
    let result
    if (agent) {
      //@ts-ignore
      //Get the Guild ID
      let id = agent?.discord.guildId.id
      //@ts-ignore
      //Using the Guild ID
      const guild = await agent?.discord.client.guilds.fetch(id)
      // Fetch all channels in the guild and handle any errors
      const channels = await guild.channels.fetch().catch(console.error)
      // Check if channels is empty or not
      if (channels.size === 0) {
        console.log('No channels found!')
      } else {
        // Loop through the channels and do something with them
        const textChannels = channels.filter(channel => channel.type === 0)
        const textChannelNames = textChannels.map(channel => channel.name)
        result = '``` Text Channels\n'
        textChannelNames.forEach(channel => {
          result += `#${channel}\n`
        })
        result += '```'
      }
    } else {
      result = 'Please Start the Discord Agent'
    }
    return {
      output: result,
    }
  }
}
