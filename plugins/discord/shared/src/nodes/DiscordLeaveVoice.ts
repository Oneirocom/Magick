// DOCUMENTED
/**
 * A simple rete component that is paired with AgentExectuor to leaves the voice channel when triggered
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

async function discordLeaveVC(
  context: ModuleContext & { prompt: string }
): Promise<string> {
  const { agent } = context
  if (!agent) {
    return 'Agent not found'
  }
  //@ts-ignore
  // const id = agent?.discord.guildId.id
  //@ts-ignore
  //Using the Guild ID
  // const guild = await agent?.discord.client.guilds.fetch(id);
  // @ts-ignore
  if (!agent?.discord) {
    return 'Discord agent not found'
  }
  // @ts-ignore
  const { discord } = agent
  if (!discord.client) {
    return 'Discord client not found'
  }
  const messageContent = context.prompt

  // Search through all the channels that the bot has access to
  let messageOBJ
  let channelOBJ
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
        channelOBJ = channel
        latestTimestamp = recentMessage.createdTimestamp
      }
    }
  }
  const voiceChannel = messageOBJ.member?.voice?.channel
  if (!voiceChannel) {
    return 'You need to be in a voice channel to talk to the bot!'
  }
  // Check if the bot is already in the voice channel
  discord.client.emit('leavevc', voiceChannel, channelOBJ)
  return 'Left Voice Channel'
}

/**
 * The return type of the worker function.
 */
type WorkerReturn = {
  output: Record<string, any>
}

/**
 * Leaves the Voice channel when triggered.
 * @category Discord
 * @remarks This node must be paired with the Agent Executor node.
 */
export class DiscordLeaveVoice extends MagickComponent<Promise<WorkerReturn>> {
  constructor() {
    super(
      'Discord Leave voice',
      {
        outputs: {
          output: 'output',
          trigger: 'option',
        },
      },
      'Discord',
      'Leaves the Voice Channel of the user who triggered the command'
    )
  }

  /**
   * The builder function for the Discore Leave Voice Node node.
   * @param node - The node being built.
   * @returns The node with its inputs and outputs.
   */
  builder(node: MagickNode) {
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('output', 'String', stringSocket)

    return node.addOutput(dataOutput).addOutput(outp)
  }

  /**
   * The worker function for the Discord Leave Voice node.
   * @param node - The node being worked on.
   * @param inputs - The inputs of the node.
   * @param _outputs - The unused outputs of the node.
   * @returns An object containing the tool.
   */
  async worker(node: WorkerData): Promise<WorkerReturn> {
    const tool_desc = {
      title: 'leave Voice Channel',
      body: 'Leaves voice channel of the user who triggered the command, also know as vc nuke, or remove disconnect',
      id: node.id,
      action: discordLeaveVC.toString(),
      function_name: 'discordLeaveVC',
      keyword:
        'discord voice call, vc delete, vc nuke, vc remove, vc disconnect, vc leave',
    }

    return {
      output: tool_desc,
    }
  }
}
