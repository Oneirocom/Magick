// DOCUMENTED
/**
 * A simple rete component that is paired with AgentExectuor to Leave the voice channel when triggered
 * @category Discord
 */
import Rete from 'shared/rete'
import {
  MagickComponent,
  stringSocket,
  triggerSocket,
  MagickNode,
  ModuleContext,
  WorkerData,
  MagickWorkerInputs,
  MagickWorkerOutputs,
} from '@magickml/core'
import { ChannelType } from '../types/ChannelType'

/**
 * Leaves the Voice Channel when triggered by the User.
 * @category Discord
 * @remarks This node must be paired with the Agent Executor node.
 */
export class DiscordLeaveVoice extends MagickComponent<Promise<void>> {
  constructor() {
    super(
      'Discord leave voice',
      {
        outputs: {
          trigger: 'option',
        },
      },
      'Integrations/Discord',
      'Leaves the vc of the user who triggered the command'
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
    const channel = new Rete.Input('channel', 'Channel', stringSocket)

    return node.addInput(dataInput).addOutput(dataOutput).addInput(channel)
  }

  /**
   * The worker function for the Discord List Voice Channels node.
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
  ): Promise<void> {
    const { agent } = context
    if (!agent || !agent?.discord) {
      console.warn('Skipping node since there is no agent available')
      return
    }

    const channel = inputs.channel?.[0] as any

    // discordClient is a Discord.js client instance
    const discordClient = agent.discord.client

    // fetch the channel using its ID
    const fetchedChannel = await discordClient.channels.fetch(channel)

    if (!fetchedChannel) {
      throw new Error('Channel not found')
    }

    if (fetchedChannel.type !== ChannelType.GuildVoice) {
      throw new Error('Channel must be a voice channel')
    }

    discordClient.emit('leavevc', fetchedChannel)
  }
}
