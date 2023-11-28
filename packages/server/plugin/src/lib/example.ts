import Discord, { GatewayIntentBits, MessagePayload } from 'discord.js'
import Redis from 'ioredis'

import { EventFormat } from './basePlugin'
import { CoreEventsPlugin } from './coreEventsPlugin'
// import { BullQueue } from 'server/core'

type DiscordPayload = {
  content: string
  sender: string
  channelId: string
  rawData: unknown
  observer: string
}

class DiscordPlugin extends CoreEventsPlugin<DiscordPayload> {
  private client: Discord.Client

  nodes = []
  values = []
  dependencies = {}

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

  /**
   * Formats the full event payload from the plugin payload.
   * This method can be used to format a message event.
   * @param event The event name.
   * @param payload The payload to format.
   * @returns Formatted event payload.
   * @example
   * formatPayload('discord:messageReceived', {
   *   content: 'Hello World',
   *   sender: 'John Doe',
   *   channelId: '1234567890',
   *   rawData: { ... },
   *   observer: 'Discord'
   * });
   */
  formatPayload(event, payload: DiscordPayload) {
    const eventPayload: EventFormat = {
      ...payload,
      client: 'Discord',
      observer: this?.client?.user?.username || 'Discord',
      channelType: event,
      data: {},
    }
    return this.formatMessageEvent(event, eventPayload)
  }

  /**
   * Formats to an event payload for a message.
   * @param messageDetails Details of the message to format.
   * @returns Formatted message event payload.
   */
  makePayloadFromMessage(message: Discord.Message): DiscordPayload {
    return {
      content: message.content,
      sender: message.author.username,
      channelId: message.channel.id,
      rawData: message,
      observer: this?.client?.user?.username || 'Discord',
    }
  }

  /**
   * Handles the Discord message creation event.
   * @param message The message that was created.
   */
  private handleMessageCreate(message: Discord.Message) {
    // add a whitelist option here probably.
    if (message.author.bot) return

    const eventName = 'discord:messageReceived'
    const pluginPayload = this.makePayloadFromMessage(message)

    // Emitting a custom event for message creation
    const payload = this.formatPayload(
      eventName,
      this.makePayloadFromMessage(message)
    )

    this.onMessage(pluginPayload)

    this.emitEvent(eventName, payload)
  }
}

export default DiscordPlugin
