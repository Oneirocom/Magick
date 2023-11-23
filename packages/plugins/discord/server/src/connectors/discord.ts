// DOCUMENTED
import { getLogger } from 'server/logger'
import { app } from 'server/core'
import Discord, {
  Client,
  AttachmentBuilder,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
  Message,
  ChannelType,
} from 'discord.js'
import emoji from 'emoji-dictionary'
import {
  initSpeechClient,
  stopSpeechClient,
  recognizeSpeech,
} from './discord-voice'

type ExtendedClient = Client & {
  embed?: EmbedBuilder
}

export class DiscordConnector {
  logger = getLogger()
  client!: ExtendedClient | null
  agent: any
  spellRunner: any = null
  guildId!: any
  message!: any
  token: string
  constructor(options) {
    const { agent, discord_api_key, spellRunner } = options
    this.agent = agent
    this.spellRunner = spellRunner
    this.token = discord_api_key

    const token = discord_api_key
    if (!token) {
      agent.warn('No API token for Discord bot, skipping')
      return
    }
    try {
      this.client = new Discord.Client({
        partials: [
          Partials.Message,
          Partials.User,
          Partials.Reaction,
          Partials.Channel,
        ],
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
        ],
      })
      const embed = new EmbedBuilder().setColor(0x00ae86)

      this.client.embed = embed

      const { client, agent, spellRunner } = this
      ;(async () => {
        if (typeof window === 'undefined') {
          this.client = initSpeechClient({
            client,
            agent,
            spellRunner,
          })
        }
      })()
      this.client.on('joinvc', async voiceChannel => {
        console.log('joinvc', voiceChannel)
        return recognizeSpeech(voiceChannel, this.agent.id)
      })
      this.client.on('leavevc', async voiceChannel => {
        stopSpeechClient(voiceChannel, this.agent.id)
      })

      this.client.on('messageCreate', async message => {
        console.log('messageCreate', message)
        this.messageCreate(message)
      })

      this.client.on('dmCreate', async message => {
        console.log('dmCreate', message)
        this.messageCreate(message)
      })

      // handle direct messages
      this.client.on('message', async message => {
        this.messageCreate(message)
      })

      this.client.on(
        'guildMemberAdd',
        async (user: { user: { id: any; username: any } }) => {
          this.handleGuildMemberAdd(user)
        }
      )
      this.client.on('guildMemberRemove', async (user: any) => {
        this.handleGuildMemberRemove(user)
      })
      this.client.on('messageReactionAdd', async (reaction: any, user: any) => {
        this.handleMessageReactionAdd(reaction, user)
      })
      this.client.on('error', err => {
        agent.error('Discord client error', err)
      })
    } catch (error: any) {
      agent.error('Error creating discord client in initializer', {
        message: error.message,
        stack: error.stack,
      })
      throw error
    }
  }

  async initialize() {
    if (!this.client) {
      throw new Error('Discord client not initialized')
    }
    return this.client.login(this.token)
  }

  async destroy() {
    console.log('destroying discord client')
    if (!this.client) {
      throw new Error('Discord client not initialized')
    }
    await this.client.destroy()
    this.client = null
  }

  //Event that is triggered when a new user is added to the server
  async handleGuildMemberAdd(user: { user: { id: any; username: any } }) {
    const username = user.user.username

    const dateNow = new Date()
    const utc = new Date(
      dateNow.getUTCFullYear(),
      dateNow.getUTCMonth(),
      dateNow.getUTCDate(),
      dateNow.getUTCHours(),
      dateNow.getUTCMinutes(),
      dateNow.getUTCSeconds()
    )
    const utcStr =
      dateNow.getDate() +
      '/' +
      (dateNow.getMonth() + 1) +
      '/' +
      dateNow.getFullYear() +
      ' ' +
      utc.getHours() +
      ':' +
      utc.getMinutes() +
      ':' +
      utc.getSeconds()

    // TODO: Replace me with direct event handler
    console.log('Discord', 'join', username, utcStr)
    // MessageClient.instance.sendUserUpdateEvent('Discord', 'join', username, utcStr)
  }

  //Event that is triggered when a user is removed from the server
  async handleGuildMemberRemove(user: { user: { id: any; username: any } }) {
    const username = user.user.username
    const dateNow = new Date()
    const utc = new Date(
      dateNow.getUTCFullYear(),
      dateNow.getUTCMonth(),
      dateNow.getUTCDate(),
      dateNow.getUTCHours(),
      dateNow.getUTCMinutes(),
      dateNow.getUTCSeconds()
    )
    const utcStr =
      dateNow.getDate() +
      '/' +
      (dateNow.getMonth() + 1) +
      '/' +
      dateNow.getFullYear() +
      ' ' +
      utc.getHours() +
      ':' +
      utc.getMinutes() +
      ':' +
      utc.getSeconds()
    // TODO: Replace me with direct message handler
    console.log('Discord', 'leave', username, utcStr)
    // MessageClient.instance.sendUserUpdateEvent('Discord', 'leave', username, utcStr)
  }

  //Event that is triggered when a user reacts to a message
  async handleMessageReactionAdd(
    reaction: { emoji?: any; message?: any },
    user: { username: string | boolean }
  ) {
    const { message } = reaction
    const emojiName = emoji.getName(reaction.emoji)

    const dateNow = new Date()
    const utc = new Date(
      dateNow.getUTCFullYear(),
      dateNow.getUTCMonth(),
      dateNow.getUTCDate(),
      dateNow.getUTCHours(),
      dateNow.getUTCMinutes(),
      dateNow.getUTCSeconds()
    )
    const utcStr =
      dateNow.getDate() +
      '/' +
      (dateNow.getMonth() + 1) +
      '/' +
      dateNow.getFullYear() +
      ' ' +
      utc.getHours() +
      ':' +
      utc.getMinutes() +
      ':' +
      utc.getSeconds()

    // TODO: Replace me with direct message handler
    console.log(
      'Discord',
      message.channel.id,
      message.id,
      message.content,
      user.username,
      emojiName,
      utcStr
    )
    // MessageClient.instance.sendMessageReactionAdd('Discord', message.channel.id, message.id, message.content, user.username, emojiName, utcStr)
  }

  //Event that is trigger when a new message is created (sent)
  messageCreate = async (message: Message) => {
    if (!this.client) {
      console.log('client not defined')
      return
    }
    if (!this.client.user) {
      console.log('client user not defined')
      return
    }
    console.log('new message from discord:', message.content)
    this.guildId = message.guild
    this.message = message

    const { content } = message

    const { author, mentions } = message

    //if the message is empty it is ignored
    if (content === '') {
      console.log('empty content')
      return
    }

    // Ignore all bots
    if (author.bot) {
      console.log('author is bot')
      return
    }

    const entities: string[] = []

    // add the mentioned users
    mentions.users.forEach(user => {
      entities.push(user.username)
    })

    // add the author if not already in the list
    if (!entities.includes(author.username)) {
      entities.push(author.username)
    }

    // add the sender if not already in the list
    if (!entities.includes(this.client.user.username)) {
      entities.push(this.client.user.username)
    }

    this.logger.info('handling message create: %s', message)

    const inputType = message.guildId === null ? 'DM' : 'Text'

    this.logger.info(
      this.agent.name,
      ' - sending message on discord - ',
      content
    )

    app.get('agentCommander').runSpell({
      inputs: {
        [`Input - Discord (${inputType})`]: {
          connector: `Discord (${inputType})`,
          content: content,
          sender: author.username,
          observer: this.client.user.username,
          client: 'discord',
          channel: message?.channel['name']
            ? message.channel['name']
            : author.id,
          channelId: message.channel.id,
          agentId: this.agent.id,
          entities: entities,
          channelType: inputType,
          rawData: JSON.stringify(message),
        },
      },
      spellId: this.agent.rootSpellId,
      agentId: this.agent.id,
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      runSubspell: true,
    })
  }

  //Event that is triggered when the discord client fully loaded
  ready = async () => {
    this.logger.info('client is ready')
  }

  async sendMessageToChannel(channelId: any, msg: any) {
    if (!this.client) {
      console.log('client not defined')
      return
    }
    try {
      const channel = await this.client.channels.fetch(channelId)
      if (msg && msg !== '' && channel && channel !== undefined) {
        const chunks = msg.match(/.{1,2000}/gs) || []

        const finalChunks = [] as any[]

        for (let i = 0; i < chunks.length; i++) {
          if (chunks[i].startsWith('```') && !chunks[i].endsWith('```')) {
            // Current chunk starts a code block but doesn't end it.
            while (i < chunks.length - 1 && !chunks[i].endsWith('```')) {
              // Keep appending chunks until we find a closing ``` or exceed the limit
              if ((chunks[i] + chunks[i + 1]).length <= 2000) {
                chunks[i] += chunks[i + 1]
                chunks.splice(i + 1, 1) // Remove the chunk we just appended
              } else {
                // Exceeding the limit. Close this chunk and start the next with ```
                chunks[i] += '```'
                chunks[i + 1] = '```' + chunks[i + 1]
                break
              }
            }
          }
          finalChunks.push(chunks[i])
        }

        // Send each chunk individually
        for (const chunk of finalChunks) {
          if (channel.isTextBased()) channel.send(chunk)
        }
      } else {
        this.logger.error(
          'Could not send message to channel: ' + channelId + '\n',
          'msg = ' + msg + '\n',
          'channel = ' + channel + '\n'
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}

export default DiscordConnector
