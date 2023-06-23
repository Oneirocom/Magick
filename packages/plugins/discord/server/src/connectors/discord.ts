// DOCUMENTED
import { getLogger } from '@magickml/core'
import { app } from '@magickml/server-core'
import Discord, {
  AttachmentBuilder,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
} from 'discord.js'
import emoji from 'emoji-dictionary'

let recognizeSpeech

export class DiscordConnector {
  logger = getLogger()
  client = Discord.Client as any
  agent: any
  spellRunner: any = null
  use_voice = false
  voice_provider!: string
  voice_character!: string
  voice_language_code!: string
  voice_endpoint!: string
  guildId!: any
  message!: any
  constructor(options) {
    const {
      agent,
      discord_api_key,
      spellRunner,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      voice_endpoint,
    } = options
    this.agent = agent
    this.spellRunner = spellRunner
    this.use_voice = use_voice
    this.voice_provider = voice_provider
    this.voice_character = voice_character
    this.voice_language_code = voice_language_code
    this.voice_endpoint = voice_endpoint

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

      if (this.use_voice) {
        const {
          client,
          agent,
          spellRunner,
          voice_provider,
          voice_character,
          voice_language_code,
          voice_endpoint,
        } = this
        ;(async () => {
          if (typeof window === 'undefined') {
            const { initSpeechClient, recognizeSpeech: _recognizeSpeech } =
              await import('./discord-voice')
            recognizeSpeech = _recognizeSpeech
            this.client = initSpeechClient({
              client,
              agent,
              spellRunner,
              voiceProvider: voice_provider,
              voiceCharacter: voice_character,
              languageCode: voice_language_code,
              voice_endpoint,
            })
          }
        })()
      }
      this.client.on('joinvc', async voiceChannel => {
        let connection
        const { recognizeSpeech: _recognizeSpeech } = await import(
          './discord-voice'
        )
        recognizeSpeech = _recognizeSpeech
        if (this.use_voice) {
          connection = recognizeSpeech(voiceChannel, this.client)
        }
        return connection
      })
      this.client.on('leavevc', async (voiceChannel, textChannel) => {
        const { stopSpeechClient: stopSpeechClient } = await import(
          './discord-voice'
        )
        if (this.use_voice) {
          stopSpeechClient(voiceChannel, this.client)
          textChannel.send('Leaving  ' + voiceChannel.name)
        } else {
          textChannel.send('Voice is disabled')
        }
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

      this.client.ws
      ;(async () => {
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

    this.logger.info('handling message create: %s', message)

    const inputType = message.guildId === null ? 'DM' : 'Text'

    this.logger.info(this.agent.name, ' - sending message on discord - ', content)
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
          channelType: inputType,
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
    this.logger.info('message deleted by', author.username, 'in', channel.id)
  }

  //Event that is triggered when the discord client fully loaded
  ready = async () => {
    this.logger.info('client is ready')
  }

  async sendImageToChannel(channelId: any, imageUri: any) {
    try {
      const channel = await this.client.channels.fetch(channelId)
      const buffer = Buffer.from(imageUri, 'base64')
      const attachment = new AttachmentBuilder(buffer, { name: 'image.png' })
      await channel.send(attachment)
    } catch (error) {
      this.logger.error(`Error sending image to channel: ${error}`)
    }
  }

  async sendMessageToChannel(channelId: any, msg: any) {
    try {
      const channel = await this.client.channels.fetch(channelId);
      if (msg && msg !== '' && channel && channel !== undefined) {
        this.logger.info('**** SENDING DISCORD MESSAGE: %s', msg);
  
        const paragraphs = msg.split(/\n{2,}/);
  
        // Process each paragraph individually
        for (const paragraph of paragraphs) {
          // Split paragraph into chunks of 2000 characters or less
          const chunks = paragraph.match(/.{1,2000}/gs) || [];
  
          // Send each chunk individually
          for (const chunk of chunks) {
            channel.send(chunk);
          }
        }
      } else {
        this.logger.error(
          'Could not send message to channel: ' + channelId +'\n',
          'msg = ' + msg +'\n',
          'channel = ' + channel +'\n'
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}

export default DiscordConnector
