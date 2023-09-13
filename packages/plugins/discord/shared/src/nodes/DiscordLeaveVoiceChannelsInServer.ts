// DOCUMENTED
/**
 * A simple rete component that is paired with AgentExectuor to list the text channels in the guild
 * @category Discord
 */

import Rete from '@magickml/rete'
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
  booleanSocket,
} from '@magickml/core'

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  left: boolean
}

/**
 * Gets the List of all text channels in a server
 * @category Discord
 * @remarks Must be paired with AgentExecutor.
 */

export class DiscordLeaveVoiceChannelsInServer extends MagickComponent<
  Promise<WorkerReturn>
> {
  constructor() {
    super(
      'Leave Voice Channels In Server',
      {
        outputs: {
          trigger: 'option',
          left: 'output',
        },
      },
      'Integrations/Discord',
      'Leave any and all voice channels in a server'
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
    const outp = new Rete.Output('left', 'Left', booleanSocket)
    const event = new Rete.Input('event', 'Event', eventSocket, true)

    return node
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
      .addInput(event)
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
  ): Promise<WorkerReturn> {
    const { agent, data } = context
    if (!agent || !agent?.discord) {
      console.warn('Skipping node since there is no agent available')
      return { left: false }
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

    async function leaveVoiceChannelInGuild(client, channelId) {
      const channel = await client.channels.fetch(channelId)
      const guild = channel.guild
      console.log('*** guild', guild)
      const voice = client.voiceFunctions
      console.log('*** voice', voice)
      const { getVoiceConnection } = voice as any
      console.log('*** getVoiceConnection', getVoiceConnection)
      const connection = getVoiceConnection(guild.id, 'default_' + agent.id)

      if (!connection) return false
      connection.destroy()
      return true
    }

    const left = await leaveVoiceChannelInGuild(discordClient, channel)

    return {
      left,
    }
  }
}
