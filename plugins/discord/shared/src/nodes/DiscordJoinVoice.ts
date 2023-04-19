// // DOCUMENTED 
// /**
//  * A simple rete component that returns the same output as the input.
//  * @category Utility
//  */
// import Rete from 'rete';
// import {
//     Agent,
//     AgentManager,
//     MagickComponent,
//     pluginManager,
//     stringSocket,
//     triggerSocket,
//     MagickNode,
//     MagickWorkerInputs,
//     MagickWorkerOutputs,
//     ModuleContext,
//     WorkerData
// } from '@magickml/core';


// async function discordTextChannels (context: ModuleContext): Promise<any> {
//     const { projectId } = context
//     const { agent } = context.module;
//     if (!agent) {
//         return "Agent not found"
//     }
//     let result = ''
//     //Get the Guild ID
//     //@ts-ignore
//     let message = agent?.discord.message;
//     if (!message.author.bot) {
//         // Get the user's voice channel
//         //@ts-ignore
//         const voiceChannel = message.member.voice.channel;
    
//         // If the user is not in a voice channel, send an error message and return
//         if (!voiceChannel) {
//           message.reply('You need to join a voice channel first!');
//           return;
//         }
//         const { initSpeechClient, recognizeSpeech: _recognizeSpeech } =
//                   await import('../../../server/src/connectors/discord-voice')
//         // Join the user's voice channel
//         try {
//             // Join the user's voice channel
//             _recognizeSpeech(voiceChannel, message.client.user.id)
      
//             // Send a confirmation message
//             return `Joined ${voiceChannel.name}!`;
//           } catch (error) {
//             console.error(error);
//             return 'Failed to join voice channel.';
//           }
//       }
//     return "Not a user";
// }


// /**
//  * The return type of the worker function.
//  */
// type WorkerReturn = {
//     output: Record<string, any>;
// }

// /**
//  * Returns the same output as the input.
//  * @category Utility
//  * @remarks This component is useful for testing purposes.
//  */
// export class DiscordJoinVoice extends MagickComponent<Promise<WorkerReturn>> {

//     constructor() {
//         super('Discord join voice', {
//             outputs: {
//                 output: 'output',
//                 trigger: 'option',
//             },
//         }, 'Discord', 'Joins the vc of the user who triggered the command');
//     }

//     /**
//      * The builder function for the Echo node.
//      * @param node - The node being built.
//      * @returns The node with its inputs and outputs.
//      */
//     builder(node: MagickNode) {
//         const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true);
//         const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket);
//         const outp = new Rete.Output('output', 'String', stringSocket);

//         return node
//             .addInput(dataInput)
//             .addOutput(dataOutput)
//             .addOutput(outp);
//     }

//     /**
//      * The worker function for the Echo node.
//      * @param node - The node being worked on.
//      * @param inputs - The inputs of the node.
//      * @param _outputs - The unused outputs of the node.
//      * @returns An object containing the same string as the input.
//      */
//     async worker(
//         node: WorkerData,
//         inputs: MagickWorkerInputs,
//         _outputs: MagickWorkerOutputs,
//         context: ModuleContext,
//     ): Promise<WorkerReturn> {

//         let tool_desc = {
//             title: 'Join Voice Channel',
//             body: 'Joins voice channel of the user who triggered the command, also know as vc join',
//             id: node.id,
//             action: discordTextChannels.toString(),
//             function_name: 'discordTextChannels',
//             keyword: 'discord voice call, vc join',

//         }

//         return {
//             output: tool_desc
//         }
//     }
// }