import Discord, { GatewayIntentBits, MessagePayload } from 'discord.js'
import Redis from 'ioredis'

import BasePlugin from './basePlugin'
// import { BullQueue } from 'server/core'

class DiscordPlugin extends BasePlugin {
  private client: Discord.Client

  constructor(connection: Redis) {
    super('DiscordPlugin', connection)
    this.client = new Discord.Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
      ], // Add other necessary intents
    })
    this.initializeFunctionalities()
  }

  initializeFunctionalities() {
    this.client.on('messageCreate', this.handleMessageCreate.bind(this))
    // ... other event handlers
    this.client.login('YOUR_DISCORD_BOT_TOKEN')
  }

  defineEvents() {
    this.registerEvent({
      eventName: 'discord:messageReceived',
      displayName: 'Message Received', // Define MessagePayload type
    })

    // ... register other Discord-specific events
  }

  private handleMessageCreate(message: Discord.Message) {
    // add a whitelist option here probably.
    if (message.author.bot) return

    const eventName = 'discord:messageReceived'

    // Emitting a custom event for message creation
    const payload = this.formatMessageEvent(eventName, {
      client: 'Discord',
      content: message.content,
      channelId: message.channel.id,
      rawData: message.toJSON(),
      channelType: eventName,
      sender: message.author.id,
      observer: this?.client?.user?.username || 'Discord',
    })

    this.emitEvent(eventName, payload)
  }
}

export default DiscordPlugin
