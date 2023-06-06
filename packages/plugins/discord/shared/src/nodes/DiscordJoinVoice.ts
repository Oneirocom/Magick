// DOCUMENTED
/**
 * A simple rete component that is paired with AgentExectuor to Join the voice channel when triggered
 * @category Discord
 */
import Rete from 'rete'
import {
  MagickComponent,
  stringSocket,
  triggerSocket,
  MagickNode,
  ModuleContext,
  WorkerData,
} from '@magickml/core'

/**
 * When triggered, the Discord agent will join the voice channel of the user who triggered the node.
 * @param context
 * @returns
 */
async function discordJoinVC(
  context: ModuleContext & { prompt: string }
): Promise<string> {
  const { agent } = context
  if (!agent) {
    return 'Agent not found'
  }
  // @ts-ignore
  if (!agent?.discord) {
    return 'Discord agent not found'
  }
  // @ts-ignore
  const { discord } = agent
  if (!discord.client) {
    return 'Discord client not found'
  }
  //console.log("DISCORD", discord.client.channels.cache)
  const messageContent = context.prompt

  // Search through all the channels that the bot has access to
  let messageOBJ
  let latestTimestamp = 0
  for (const [, channel] of discord.client.channels.cache) {
    // Check if the channel is a text channel
    console.log('CHANNEL', channel)
    if (channel.type === 0) {
      // Fetch the messages in the channel
      const messages = await channel.messages.fetch()
      // Sort the messages in descending order based on their timestamps
      const sortedMessages = messages.sort(
        (a, b) => b.createdTimestamp - a.createdTimestamp
      )
      // Find the most recent message that matches the message content
      const recentMessage = sortedMessages.find(
        msg => msg.content === messageContent
      )
      if (recentMessage && recentMessage.createdTimestamp > latestTimestamp) {
        messageOBJ = recentMessage
        latestTimestamp = recentMessage.createdTimestamp
      }
    }
  }
  if (!messageOBJ) {
    return 'Message not found'
  }
  const voiceChannel = messageOBJ.member?.voice?.channel
  if (!voiceChannel) {
    return 'You need to be in a voice channel to talk to the bot!'
  }
  discord.client.emit('joinvc', voiceChannel)
  return 'Joined Voice Channel'
}

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: Record<string, any>
}

/**
 * Joins the Voice Channel when triggered by the User.
 * @category Discord
 * @remarks This node must be paired with the Agent Executor node.
 */
export class DiscordJoinVoice extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Discord join voice',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Discord',
      'Joins the vc of the user who triggered the command'
    )
  }

  /**
   * The builder function for the Echo node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    return node.addOutput(dataOutput).addOutput(outp)
  }

  /**
   * The worker function for the Discord Join Voice node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the tool object.
   */
  async worker(node: WorkerData): Promise<WorkerReturn> {
    const tool_desc = {
      title: 'Join Voice Channel',
      body: 'Joins voice channel of the user who triggered the command, also know as vc join',
      id: node.id,
      action: discordJoinVC.toString(),
      function_name: 'discordJoinVC',
      keyword:
        'discord voice call, vc join, Join/connect/enter/hop on/participate in the voice channel/call/chat and speak/engage in the audio chat',
    }

    return {
      output: tool_desc,
    }
  }
}
