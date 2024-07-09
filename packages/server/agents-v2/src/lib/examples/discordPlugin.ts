// import { EventEmitter } from 'events'
// import {
//   Client,
//   GatewayIntentBits,
//   ChannelType,
//   TextChannel,
//   EmbedBuilder,
// } from 'discord.js'
// import { createPlugin, Agent, EventPayload } from './Agent' // Assuming we've exported these from our new Agent file
// import { DiscordMessageUtils } from './services/discord-message-utils'

// type DiscordEvents = {
//   messageCreate: (
//     payload: EventPayload<{ message: any; attachments: any[] }>
//   ) => void
//   // Add other Discord events as needed
// }

// const DISCORD_EVENTS = {
//   messageCreate: 'messageCreate',
//   // Add other events...
// }

// const DISCORD_ACTIONS = {
//   sendMessage: 'sendMessage',
//   streamMessage: 'streamMessage',
// }

// const discordPlugin = createPlugin<DiscordEvents>(
//   'discord',
//   DISCORD_EVENTS,
//   () => ({
//     nodes: [
//       // Add Discord-specific nodes here
//     ],
//     values: [],
//     dependencies: {
//       discordClient: new Client({
//         intents: [
//           GatewayIntentBits.Guilds,
//           GatewayIntentBits.GuildMessages,
//           GatewayIntentBits.MessageContent,
//           // Add other intents as needed
//         ],
//       }),
//     },
//   }),
//   async agent => {
//     const discord = agent.getRegistry().dependencies.discordClient as Client
//     const utils = new DiscordMessageUtils(agent.id)

//     await discord.login(process.env.DISCORD_TOKEN) // You might want to use a more secure way to pass the token

//     discord.on('messageCreate', message => {
//       if (utils.checkIfBotMessage(message)) return

//       const attachments = message.attachments.map(attachment =>
//         attachment.toJSON()
//       )

//       agent.emit(
//         'messageCreate',
//         utils.createEventPayload(
//           'messageCreate',
//           message.toJSON(),
//           {
//             // Add context here
//           },
//           { attachments }
//         )
//       )
//     })

//     // Implement other event listeners

//     // Implement action handlers
//     agent.on(
//       DISCORD_ACTIONS.sendMessage,
//       async (payload: EventPayload<{ content: string; channelId: string }>) => {
//         const { content, channelId } = payload.data
//         const channel = (await discord.channels.fetch(channelId)) as TextChannel
//         await channel.send(content)
//       }
//     )

//     agent.on(
//       DISCORD_ACTIONS.streamMessage,
//       async (payload: EventPayload<{ content: string; channelId: string }>) => {
//         // Implement streaming logic here, similar to the original streamMessage function
//       }
//     )
//   }
// )
