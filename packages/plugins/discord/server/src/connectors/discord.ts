// DOCUMENTED
import { app } from '@magickml/server-core'
import Discord, {
  AttachmentBuilder,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
} from 'discord.js'
import emoji from 'emoji-dictionary'

export class DiscordConnector {
  client = Discord.Client as any
  agent: any
  spellRunner: any = null
  guildId!: any
  message!: any
  constructor(options) {
    const {
      agent,
      discord_api_key,
      spellRunner,
    } = options
    this.agent = agent
    this.spellRunner = spellRunner

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

      const {
        client,
        agent,
        spellRunner,
      } = this
        ; (async () => {
          if (typeof window === 'undefined') {
            const { initSpeechClient } =
              await import('./discord-voice')
            this.client = initSpeechClient({
              client,
              agent,
              spellRunner,
            })
          }
        })()
      this.client.on('joinvc', async voiceChannel => {
        const { recognizeSpeech } = await import(
          './discord-voice'
        )
        return recognizeSpeech(voiceChannel, this.client.user.id)
      })
      this.client.on('leavevc', async (voiceChannel) => {
        const { stopSpeechClient } = await import(
          './discord-voice'
        )
        stopSpeechClient(voiceChannel, this.client)
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
        console.log('message')
        if (message.channel.type === 'dm') {
          console.log('direct message', message)
          this.messageCreate(message)
        } else {
          this.messageCreate(message)
        }
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

      this.client.ws
        ; (async () => {
          try {
            const login = await this.client.login(token)
            agent.log('Discord client logged in', { login })
          } catch (e) {
            return agent.error('Error logging in discord client', e)
          }

          this.client.on('error', err => {
            agent.error('Discord client error', err)
          })
        })()
    } catch (e) {
      agent.error('Error creating discord client', e)
    }
  }

  async destroy() {
    console.log('destroying discord client')
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
  messageCreate = async (message: any) => {
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

    const entities: {
      user: string
    }[] = []

    // add the mentioned users
    mentions.users.forEach(user => {
      entities.push(user.username)
    })

    // add the author if not already in the list
    if (!entities.includes(author.username)) {
      entities.push(author.username)
    }

    // add the sender if not already in the list
    if (!entities.includes(author.username)) {
      entities.push(this.client.user.username)
    }

    const inputType = message.channel.type === 'dm' ? 'DM' : 'Text'

    console.log(this.agent.name, ' - sending message on discord - ', content)
    await this.spellRunner.runComponent({
      inputs: {
        [`Input - Discord (${inputType})`]: {
          connector: `Discord (${inputType})`,
          content: content,
          sender: author.username,
          observer: this.client.user.username,
          client: 'discord',
          channel: message.channel.id,
          agentId: this.agent.id,
          entities: entities,
          channelType: message.channel.type,
          rawData: JSON.stringify(message),
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      runSubspell: true,
      app,
    })
  }

  //Event that is triggered when a message is deleted
  messageDelete = async (
    client: { user: any },
    message: { author: any; channel: any; id: any }
  ) => {
    const { author, channel } = message
    if (!author) return
    if (!client || !client.user) return
    if (author.id === this.client.user.id) return
    console.log('message deleted by', author.username, 'in', channel.id)
  }

  //Event that is triggered when the discord client fully loaded
  ready = async () => {
    console.log('client is ready')
  }

  async sendImageToChannel(channelId: any, imageUri: any) {
    try {
      const channel = await this.client.channels.fetch(channelId)
      const buffer = Buffer.from(imageUri, 'base64')
      const attachment = new AttachmentBuilder(buffer, { name: 'image.png' })
      await channel.send(attachment)
    } catch (error) {
      console.error(`Error sending image to channel: ${error}`)
    }
  }

  async sendDMToUser(userId: any, msg: any) {
    try {
      const user = await this.client.users.fetch(userId)
      if (msg && msg !== '' && user && user !== undefined) {
        console.log('**** SENDING DISCORD MESSAGE', msg)
        // split msg into an array of messages that are less than 2000 characters
        // if msg is an object, get the valuke of the first key
        if (typeof msg === 'object') {
          msg = Object.values(msg)[0]
        }
        const msgArray = msg.match(/.{1,2000}/g)
        // send each message individually
        msgArray.forEach(msg => {
          user.send(msg)
        })
      } else {
        console.error(
          'could not send message to user: ' + userId,
          'msg = ' + msg,
          'user = ' + user
        )
      }
    } catch (e) {
      console.error(e)
    }
  }

  async sendMessageToChannel(channelId: any, msg: any) {
    try {
      const channel = await this.client.channels.fetch(channelId)
      if (msg && msg !== '' && channel && channel !== undefined) {
        // split msg into an array of messages that are less than 2000 characters
        // if msg is an object, get the valuke of the first key
        if (typeof msg === 'object') {
          msg = Object.values(msg)[0]
        }
        const msgArray = msg.match(/.{1,2000}/g)
        // send each message individually
        msgArray.forEach(msg => {
          channel.send(msg)
        })
      } else {
        console.error(
          'could not send message to channel: ' + channelId,
          'msg = ' + msg,
          'channel = ' + channel
        )
      }
    } catch (e) {
      console.error(e)
    }
  }
}

export default DiscordConnector
