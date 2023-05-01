// DOCUMENTED 
/**
 * A simple rete component that is paired with AgentExectuor to list the text channels in the guild
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

async function discordTextChannels (context: ModuleContext): Promise<any> {
    // const { projectId } = context
    const { agent } = context.module;
    if (!agent) {
        return "Agent not found";
    }
    // @ts-ignore
    if (!agent?.discord) {
        return "Discord agent not found";
    }
    // @ts-ignore
    const { discord } = agent;
    if (!agent) {
        return "Agent not found"
    }

    let result = ''
    //@ts-ignore
    //Get the Guild ID
    
    const channels = discord.client.channels.cache
    // Check if channels is empty or not
    if (channels.size === 0) {
        return "No channels found!";
    } else {
        // Loop through the channels and do something with them
        const textChannels = channels.filter(channel => channel.type === 0);
        const textChannelNames = textChannels.map(channel => channel.name);
        result = '``` Text Channels\n';
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
 * Gets the List of all text channels in a server
 * @category Discord
 * @remarks Must be paired with AgentExecutor.
 */
export class DiscordListTextChannels extends MagickComponent<Promise<WorkerReturn>> {

    constructor() {
        super('Discord Text Channels', {
            outputs: {
                output: 'output',
                trigger: 'option',
            },
        }, 'Discord', 'Gets the List of All text channels in a server');
    }

    /**
     * The builder function for the Echo node.
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
     * The worker function for the Discord List Text Channels node.
     * @param node - The node being worked on.
     * @param inputs - The inputs of the node.
     * @param _outputs - The unused outputs of the node.
     * @returns An object containing the tool properties.
     */
    async worker(
        node: WorkerData,
    ): Promise<WorkerReturn> {

        const tool_desc = {
            title: 'Discord List Text Channels',
            body: 'Gets the List of text channels in a server',
            id: node.id,
            action: discordTextChannels.toString(),
            function_name: 'discordTextChannels',
            keyword: 'discord text channels',

        }

        return {
            output: tool_desc
        }
    }
}