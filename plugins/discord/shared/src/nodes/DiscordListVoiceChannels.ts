// DOCUMENTED 
/**
 * A simple rete component that is paired with AgentExectuor to list the voice channels in the guild
 * @category Discord
 */

import Rete from 'rete';
import {
    MagickComponent,
    stringSocket,
    triggerSocket,
    MagickNode,
    ModuleContext,
    WorkerData
} from '@magickml/core';


async function discord_list_channels(context: ModuleContext): Promise<any> {
    // const { projectId } = context
    const { agent } = context.module;
    if (!agent) {
        return "Agent not found"
    }
    let result = ''
    // Fetch all channels in the guild and handle any errors
    //@ts-ignore
    const channels = agent.discord.client.channels.cache
    // Check if channels is empty or not
    if (channels.size === 0) {
        return "No channels found!";
    } else {
        // Loop through the channels and do something with them
        const textChannels = channels.filter(channel => channel.type === 2);
        const textChannelNames = textChannels.map(channel => channel.name);
        result = '``` Voice Channels\n';
        textChannelNames.forEach(channel => {
            result += `#${channel}\n`;
        });
        result += '```';
    }
    return result;
}


/**
 * The return type of the worker function.
 */
type WorkerReturn = {
    output: Record<string, any>;
}

/**
 * Outputs the List of all the voice channels in the server
 * @category Discord
 * @remarks Must be paired with AgentExecutor
 */
export class DiscordListVoiceChannels extends MagickComponent<Promise<WorkerReturn>> {

    constructor() {
        super('Discord Voice Channels', {
            outputs: {
                output: 'output',
                trigger: 'option',
            },
        }, 'Discord', 'Gets the List of All voice channels in a server');
    }

    /**
     * The builder function for the Discord List Voice Channel nodes.
     * @param node - The node being built.
     * @returns The node with its inputs and outputs.
     */
    builder(node: MagickNode) {
        const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
        const outp = new Rete.Output('output', 'String', stringSocket);

        return node
            .addOutput(dataOutput)
            .addOutput(outp);
    }

    /**
     * The worker function for the Discord List Voice Channel node.
     * @param node - The node being worked on.
     * @param inputs - The inputs of the node.
     * @param _outputs - The unused outputs of the node.
     * @returns An object containing the tool properties.
     */
    async worker(
        node: WorkerData,
    ): Promise<WorkerReturn> {

        const tool_desc = {
            title: 'Discord List Voice Channels',
            body: 'Gets the list of all the voice channels also known as vc in the server and only the voice channels',
            id: node.id,
            action: discord_list_channels.toString(),
            function_name: 'discord_list_channels',
            keyword: 'Discord voice channels, get audio channels, server audio channels, voice channels, server voice channels, fetch audio channels, get audio channels from server.',

        }

        return {
            output: tool_desc
        }
    }
}