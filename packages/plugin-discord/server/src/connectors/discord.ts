import { AgentInterface, WorldManager } from '@magickml/engine'
import Discord, {
  ChannelType,
  EmbedBuilder,
  GatewayIntentBits,
  Partials,
  SnowflakeUtil
} from 'discord.js'
import emoji from 'emoji-dictionary'
import emojiRegex from 'emoji-regex'

let recognizeSpeech

export const startsWithCapital = word => {
  return word.charAt(0) === word.charAt(0).toUpperCase()
}
const log = (...s: (string | boolean)[]) => {
  console.log(...s)
}
interface UserObject {
  user: string;
  inConversation: boolean;
  isBot: boolean;
  info3d: string;
}
export class DiscordConnector {
  client = Discord.Client as any
  agent?: AgentInterface
  spellRunner: any = null
  discord_wake_words: string[] = []
  discord_userid = ''
  discord_bot_name = 'Bot'
  use_voice = false
  voice_provider!: string
  voice_character!: string
  voice_language_code!: string
  tiktalknet_url!: string
  worldManager: WorldManager
  constructor(options) {
    console.log('options are', options)
    const {
      agent,
      discord_api_key,
      discord_wake_words,
      discord_userid,
      discord_bot_name,
      spellRunner,
      use_voice,
      voice_provider,
      voice_character,
      voice_language_code,
      tiktalknet_url,
      worldManager,
    } = options
    this.worldManager = worldManager
    this.agent = agent
    this.spellRunner = spellRunner
    this.use_voice = use_voice
    this.voice_provider = voice_provider
    this.voice_character = voice_character
    this.voice_language_code = voice_language_code
    this.tiktalknet_url = tiktalknet_url
    if (!discord_wake_words || discord_wake_words?.length <= 0) {
      this.discord_wake_words = ['hi', 'hey']
    } else {
      this.discord_wake_words = discord_wake_words?.split(',')
      for (let i = 0; i < this.discord_wake_words.length; i++) {
        this.discord_wake_words[i] = this.discord_wake_words[i]
          .trim()
          .toLowerCase()
      }
    }
    this.discord_userid = discord_userid
    this.discord_bot_name = discord_bot_name

    const token = discord_api_key
    if (!token) {
      console.warn('No API token for Discord bot, skipping')
    } else {
      this.client = new Discord.Client({
        partials: [Partials.Message, Partials.User, Partials.Reaction],
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildVoiceStates,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildPresences,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.GuildVoiceStates,
        ],
      })
      this.client.prefix = '!'
      this.client.prefixOptionalWhenMentionOrDM = true

      this.client.on('debug', message => {
        console.log('debug', message)
      })

      this.client.name_regex = new RegExp(discord_bot_name, 'ig')

      this.client.username_regex = new RegExp(this.discord_userid, 'ig') //'((?:digital|being)(?: |$))'
      this.client.edit_messages_max_count = 5

      const embed = new EmbedBuilder().setColor(0x00ae86)

      this.client.embed = embed

      if (this.use_voice) {
        const {
          client,
          discord_bot_name,
          agent,
          spellRunner,
          voice_provider,
          voice_character,
          voice_language_code,
          tiktalknet_url,
        } = this
          ; (async () => {
            if (typeof window === 'undefined') {
              const { initSpeechClient, recognizeSpeech: _recognizeSpeech } =
                await import('./discord-voice')
              recognizeSpeech = _recognizeSpeech
              this.client = initSpeechClient({
                client,
                discord_bot_name,
                agent,
                spellRunner,
                voiceProvider: voice_provider,
                voiceCharacter: voice_character,
                languageCode: voice_language_code,
                tiktalknet_url,
              })
            }
          })()
      }

      this.client.on(
        'messageCreate',
        this.messageCreate.bind(null, this.client)
      )

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

      this.client.login(token)
    }
  }

  discussionChannels = {}

  async destroy() {
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

    // TODO: Replace me with direct message handler
    log('Discord', 'join', username, utcStr)
    // MessageClient.instance.sendUserUpdateEvent('Discord', 'join', username, utcStr)
  }
  
  async getActiveUsers(channel: any, k: number) {
    try {
      // Fetch the last 200 messages
      const messages = await channel.messages.fetch({ limit: 100 });
      console.log(`Fetched ${messages.size} messages.`);
  
      // Get the timestamp of the last message
      const lastTimestamp = messages.last().createdTimestamp;
  
      // Calculate the time one hour ago
      const now = new Date();
      const pastHour = new Date(now.getTime() - 60 * 60 * 1000);
  
      // Filter messages sent within the past hour
      const messagesWithinPastHour = messages.filter(message => message.createdTimestamp >= pastHour);
  
      const activeUsers: UserObject[] = [];
  
      if (messagesWithinPastHour.size > 100) {
        // Count the number of messages sent by each user
        const userCounts = {};
        messagesWithinPastHour.forEach(message => {
          const userId = message.author.id;
          userCounts[userId] = (userCounts[userId] || 0) + 1;
        });
  
        // Get the list of top active users
        const topActiveUserIds = Object.keys(userCounts)
          .sort((a, b) => userCounts[b] - userCounts[a])
          .slice(0, k);
  
        // Get the member objects for the top active users
        const topActiveMembers = await Promise.all(topActiveUserIds.map(userId => channel.guild.members.fetch(userId)));
  
        // Add each top active member to the activeUsers array
        topActiveMembers.forEach(member => {
          activeUsers.push({
            user: member.user.username,
            inConversation: this.isInConversation(member.user.id), // replace this with your own method to check if the user is in conversation
            isBot: member.user.bot,
            info3d: '',
          });
        });
  
        console.log(`Found ${activeUsers.length} active users with more than 100 messages sent within the past hour.`);
      }
      else {
        // Get the list of all users who sent messages within the past hour
        const allUserIds = Array.from(new Set(messagesWithinPastHour.map(message => message.author.id)));
  
        // Get the member objects for all users
        const allMembers = await Promise.all(allUserIds.map(userId => channel.guild.members.fetch(userId)));
  
        // Add each member to the activeUsers array
        allMembers.forEach(member => {
          activeUsers.push({
            user: member.user.username,
            inConversation: this.isInConversation(member.user.id), // replace this with your own method to check if the user is in conversation
            isBot: member.user.bot,
            info3d: '',
          });
        });
  
        console.log(`Found ${activeUsers.length} active users with less than 100 messages sent within the past hour.`);
      }
  
      // do something with the activeUsers array
      console.log(activeUsers);
      return activeUsers
    }
    catch (error) {
      console.error(error);
    }
    return []
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
    log('Discord', 'leave', username, utcStr)
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
    log(
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

  getUserFromMention(mention) {
    if (!mention) return mention

    if (mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1)
      console.log('found mention:', mention)

      if (mention.startsWith('!')) {
        mention = mention.slice(1)
      }

      const user = this.client.users.cache.get(mention)
      console.log('user mention:', user?.username)
      if (user && user !== undefined) {
        return user.username
      } else {
        return mention
      }
    }

    return mention
  }

  //Event that is trigger when a new message is created (sent)
  messageCreate = async (client: any, message: any) => {
    console.log('new message from discord:', message.content)

    //gets the emojis from the text and replaces to unix specific type
    const reg = emojiRegex()
    let match
    const emojis: any[] = []
    while ((match = reg.exec(message.content)) !== null) {
      console.log('EMOJIS')
      emojis.push({ name: emoji.getName(match[0]), emoji: match[0] })
      message.content = message.content.replace(
        match[0],
        match[0] + ' :' + emoji.getName(match[0]) + ':'
      )
    }
    const args = {}
    args['grpc_args'] = {}

    let { author, channel, content, mentions, id } = message

    //replaces the discord specific mentions (<!@id>) to the actual mention
    content = content.split(' ')
    for (let i = 0; i < content.length; i++) {
      content[i] = this.getUserFromMention(content[i])
    }
    content = content.join(' ')

    //if the message is empty it is ignored
    if (content === '') {
      console.log('empty content')
      return
    }
    let _prev = undefined

    //if the author is not a bot, it adds the message to the conversation simulation
    if (!author.bot) {
      _prev = this.prevMessage[channel.id]
      this.prevMessage[channel.id] = author
      if (this.prevMessageTimers[channel.id] !== undefined)
        clearTimeout(this.prevMessageTimers[channel.id])
      this.prevMessageTimers[channel.id] = setTimeout(
        () => (this.prevMessage[channel.id] = ''),
        120000
      )
    }
    // Ignore all bots
    if (author.bot) {
      console.log('author is bot')
      return
    }
    //checks if the message contains a direct mention to the bot, or if it is a DM, or if it mentions someone else
    const botMention = `<@!${client.user}>`
    const isDM = channel.type === ChannelType.DM
    const isMention =
      (channel.type === ChannelType.GuildText && mentions.has(client.user)) ||
      isDM
    const otherMention =
      !isMention && mentions.members !== null && mentions.members.size > 0
    let startConv = false
    let startConvName = ''
    //if it isn't a mention to the bot or another mention or a DM
    //it works with the word hi and the next word should either not exist or start with a lower letter to start the conversation
    if (!isMention && !isDM && !otherMention) {
      const trimmed = content.trimStart()
      for (let i = 0; i < this.discord_wake_words.length; i++) {
        if (trimmed.toLowerCase().startsWith(this.discord_wake_words[i])) {
          const parts = trimmed.split(' ')
          if (parts.length > 1) {
            if (!startsWithCapital(parts[1])) {
              startConv = true
            } else {
              startConv = false
              startConvName = parts[1]
            }
          } else {
            if (trimmed.toLowerCase() === this.discord_wake_words[i]) {
              startConv = true
            }
          }
        }
      }
    }
    //if it is a mention to another user, then the conversation with the bot is ended
    if (otherMention) {
      this.exitConversation(author.id)
      mentions.members.forEach((pinged: { id: any }) =>
        this.exitConversation(pinged.id)
      )
    }
    if (!startConv && !isMention) {
      if (startConvName.length > 0) {
        this.exitConversation(author.id)
        this.exitConversation(startConvName)
      }
    }
    //checks if the user is in discussion with the but, or includes !ping or started the conversation, if so it adds (if not exists) !ping in the start to handle the message the ping command
    const isDirectMention =
      !content.startsWith('!') &&
      content.toLowerCase().includes(this.discord_bot_name?.toLowerCase())
    const isUserNameMention =
      (channel.type === ChannelType.GuildText || isDM) &&
      content &&
      content
        .toLowerCase()
        .replace(',', '')
        .replace('.', '')
        .replace('?', '')
        .replace('!', '')
        .match(client.username_regex)
    const isInDiscussion = this.isInConversation(author.id)

    console.log(content)
    if (!content.startsWith('!') && !otherMention) {
      if (isMention) content = '!ping ' + content.replace(botMention, '').trim()
      else if (isDirectMention)
        content = '!ping ' + content.replace(client.name_regex, '').trim()
      else if (isUserNameMention) {
        content = '!ping ' + content.replace(client.username_regex, '').trim()
      } else if (isInDiscussion || startConv) content = '!ping ' + content
    }
    console.log(content)
    if (!content.startsWith('!ping')) {
      if (
        this.discussionChannels[channel.id] !== undefined &&
        this.discussionChannels[channel.id]
      ) {
        if (!this.discussionChannels[channel.id].responded) {
          this.discussionChannels[channel.id].responded = true
          content = '!ping ' + content
        }
      }

      if (!content.startsWith('!ping')) {
        let values = ''
        const msgs = await channel.messages.fetch({ limit: 10 })
        if (msgs && msgs.size > 0) {
          for (const [key, value] of msgs.entries()) {
            if (value && value !== undefined) {
              values += value.content
              // if (value.author.bot) {
              //   agentTalked = true
              // }
            }
          }
        }
      }
    }
    //if the message contains join word, it makes the bot to try to join a voice channel and listen to the users
    if (content.startsWith('!ping')) {
      console.log('CONTENT STARTS with PING')
      this.sentMessage(author.id)
      const mention = `<@!${client.user.id}>`
      if (
        content.startsWith('!ping join') ||
        content.startsWith('!join') ||
        content.startsWith('!ping ' + mention + ' join')
      ) {
        console.log('MENTIONS JOIN')
        const d = content.split(' ')
        const index = d.indexOf('join') + 1
        console.log('d:', d)
        console.log(
          'joining channel:',
          d[index],
          'bot name:',
          this.discord_bot_name
        )
        if (d.length > index) {
          const channelName = d[index]
          await message.guild.channels.cache.forEach(
            async (channel: {
              type: ChannelType
              name: any
              join: () => any
              leave: () => void
            }) => {
              if (
                this.use_voice &&
                channel.type === ChannelType.GuildVoice &&
                channel.name === channelName
              ) {
                if (this.agent) {
                  recognizeSpeech(channel, this.agent.id)
                }
                return false
              }
            }
          )
          return
        }
      }
    }

    // Set flag to true to skip using prefix if mentioning or DMing us
    const prefixOptionalWhenMentionOrDM =
      this.client.prefixOptionalWhenMentionOrDM

    const msgStartsWithMention = content.startsWith(botMention)

    const messageContent =
      isMention && msgStartsWithMention
        ? content.replace(botMention, '').trim()
        : content

    const containsPrefix = messageContent.indexOf(this.client.prefix) === 0

    // If we are not being messaged and the prefix is not present (or bypassed via config flag), ignore message,
    // so if msg does not contain prefix and either of
    //   1. optional flag is not true or 2. bot has not been DMed or mentioned,
    // then skip the message.
    if (
      !containsPrefix &&
      (!prefixOptionalWhenMentionOrDM || (!isMention && !isDM))
    )
      return

    setTimeout(() => {
      channel.sendTyping()
    }, message.content.length)

    const entities: {
      user: string
      inConversation: boolean
      isBot: boolean
      info3d: string
    }[] = []
    let now = new Date();
    let pastHour = new Date(now.getTime() - 60 * 60 * 1000); // calculate the time one hour ago
    const snowflake = SnowflakeUtil.generate();
    let msgs = await this.getActiveUsers(channel, 12) as unknown as any[]
    console.log(msgs)
    msgs.forEach(element => {
      entities.push({
        user: element.user,
        inConversation: element.inConversation,
        isBot: element.isBot,
        info3d: '',
      })
    });
    if (content.startsWith('!ping ')) {
      content = content.replace('!ping ', '')
    }
    console.log(content)
    console.log('calling runComponent from discord.ts')
    console.log('publicVariables', this.agent.publicVariables)
    const response = await this.spellRunner.runComponent({
      inputs: {
        'Input - Discord (Text)': {
          content: content,
          sender: message.author.username,
          observer: this.discord_bot_name,
          client: 'discord',
          channel: message.channel.id,
          agentId: this.agent.id,
          entities: entities.map(e => e.user),
          channelType: 'msg',
        },
      },
      agent: this.agent,
      secrets: this.agent.secrets,
      publicVariables: this.agent.publicVariables,
      runSubspell: true,
    })

    if(!response) {
      console.warn('Discord: No response outputs')
      return
    }

    const { Output /*Image*/ } = response

    if(!Output) {
      console.warn('Discord: No Output')
      return
    }

    // get the value of the first entry in the object
    const firstValue = Output || Object.values(response)[0]

    console.log('handled response', firstValue)
    if (!firstValue || firstValue === "") {
      message.channel.send("Error: Empty Resonse")
    } else message.channel.send(firstValue)
  }

  //Event that is triggered when a message is deleted
  messageDelete = async (
    client: { user: any },
    message: { author: any; channel: any; id: any }
  ) => {
    const { author, channel, id } = message
    if (!author) return
    if (!client || !client.user) return
    if (author.id === this.client.user.id) return

    const oldResponse = this.getResponse(channel.id, id)
    if (oldResponse === undefined) return

    await channel.messages
      .fetch({ limit: this.client.edit_messages_max_count })
      .then(async (messages: any[]) => {
        messages.forEach((resp: { id: any; delete: () => void }) => {
          if (resp.id === oldResponse) {
            resp.delete()
          }
        })
      })
      .catch((err: string | boolean) => log(err))

    this.onMessageDeleted(channel.id, id)
  }

  //Event that is triggered when a message is updated (changed)
  messageUpdate = async (
    client: any,
    message: { author: any; channel: any; id: any }
  ) => {
    const { author, channel, id } = message
    if (author === null || channel === null || id === null) return
    if (author.id === this.client.user.id) {
      log('same author')
      return
    }

    const oldResponse = this.getResponse(channel.id, id)
    if (oldResponse === undefined) {
      await channel.messages.fetch(id).then(async (msg: any) => { })
      log('message not found')
      return
    }

    channel.messages
      .fetch(oldResponse)
      .then(async (msg: any) => {
        channel.messages
          .fetch({ limit: this.client.edit_messages_max_count })
          .then(async (messages: any[]) => {
            messages.forEach(
              async (edited: {
                id: string | boolean
                content: string | boolean
                channel: { id: string | boolean }
              }) => {
                if (edited.id === id) {
                  const date = new Date()
                  const utc = new Date(
                    date.getUTCFullYear(),
                    date.getUTCMonth(),
                    date.getUTCDate(),
                    date.getUTCHours(),
                    date.getUTCMinutes(),
                    date.getUTCSeconds()
                  )
                  const utcStr =
                    date.getDate() +
                    '/' +
                    (date.getMonth() + 1) +
                    '/' +
                    date.getFullYear() +
                    ' ' +
                    utc.getHours() +
                    ':' +
                    utc.getMinutes() +
                    ':' +
                    utc.getSeconds()

                  let parentId = ''
                  if (channel.type === ChannelType.PublicThread) {
                    parentId = channel.prefixOptionalWhenMentionOrDM
                  }

                  // TODO: Replace message with direct message handler
                  log(
                    edited.content,
                    edited.id,
                    'Discord',
                    edited.channel.id,
                    utcStr,
                    false,
                    'parentId:' + parentId
                  )
                  // MessageClient.instance.sendMessageEdit(edited.content, edited.id, 'Discord', edited.channel.id, utcStr, false, 'parentId:' + parentId)
                }
              }
            )
          })
      })
      .catch((err: string) => log(err))
  }

  //Event that is trigger when a user's presence is changed (offline, idle, online)
  presenceUpdate = async (
    client: any,
    oldMember: { status: any },
    newMember: { userId: string; status: string | boolean }
  ) => {
    if (!oldMember || !newMember) {
      log('Cannot update presence, oldMember or newMember is null')
    } else if (oldMember.status !== newMember.status) {
      const date = new Date()
      const utc = new Date(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      )
      const utcStr =
        date.getDate() +
        '/' +
        (date.getMonth() + 1) +
        '/' +
        date.getFullYear() +
        ' ' +
        utc.getHours() +
        ':' +
        utc.getMinutes() +
        ':' +
        utc.getSeconds()

      this.client.users
        .fetch(newMember.userId)
        .then((user: { username: string | boolean }) => {
          if (newMember.status === 'online') {
            this.worldManager.addUser(user.username, 'discord')
          } else {
            this.worldManager.removeUser(user.username, 'discord')
          }
          // TODO: Replace message with direct message handler
          log('Discord', newMember.status, user.username, utcStr)
          // MessageClient.instance.sendUserUpdateEvent('Discord', newMember.status, user.username, utcStr)
        })
    }
  }

  //Event that is triggered when the discord client fully loaded
  ready = async (client: { user: { id: any } }) => {
    const logDMUserID = false
    await this.client.users
      .fetch(logDMUserID)
      .then((user: any) => {
        this.client.log_user = user
      })
      .catch((error: string | boolean) => {
        log(error)
      })

    //rgisters the slash commands to each server
    await this.client.guilds.cache.forEach(
      (server: {
        deleted: any
        name: string
        id: any
        channels: { cache: any[] }
      }) => {
        if (!server.deleted) {
          log('fetching messages from server: ' + server.name)
          this.client.api
            .applications(client.user.id)
            .guilds(server.id)
            .commands.post({
              data: {
                name: 'continue',
                description: 'makes the agent continue',
              },
            })
          this.client.api
            .applications(client.user.id)
            .guilds(server.id)
            .commands.post({
              data: {
                name: 'single_continue',
                description: 'test',
              },
            })
          this.client.api
            .applications(client.user.id)
            .guilds(server.id)
            .commands.post({
              data: {
                name: 'say',
                description: 'makes the agent say something',
                options: [
                  {
                    name: 'text',
                    description: 'text',
                    type: 3,
                    required: true,
                  },
                ],
              },
            })

          //adds unread message to the chat history from each channel
          server.channels.cache.forEach(
            async (channel: {
              type: ChannelType
              deleted: boolean
              permissionsFor: (arg0: any) => {
                (): any
                new(): any
                has: { (arg0: string[]): any; new(): any }
              }
              name: string | boolean
              id: string | boolean
              topic: any
              messages: { fetch: (arg0: { limit: number }) => Promise<any> }
            }) => {
              if (
                channel.type === ChannelType.GuildText &&
                channel.deleted === false &&
                channel
                  .permissionsFor(client.user.id)
                  .has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
              ) {
                // TODO: Replace message with direct message handler
                log(
                  channel.name,
                  'Discord',
                  channel.id,
                  channel.topic || 'none'
                )
                // MessageClient.instance.sendMetadata(channel.name, 'Discord', channel.id, channel.topic || 'none')
                channel.messages
                  .fetch({ limit: 100 })
                  .then(async (messages: any[]) => {
                    messages.forEach(
                      async (msg: {
                        author: { username: string; isBot: any }
                        deleted: boolean
                        content: string
                        id: any
                        createdTimestamp: any
                      }) => {
                        let _author = msg.author.username
                        if (
                          msg.author.isBot ||
                          msg.author.username
                            .toLowerCase()
                            .includes('digital being')
                        )
                          _author = this.discord_bot_name

                        if (msg.deleted === true) {
                          // await deleteMessageFromHistory(channel.id, msg.id)
                          log('deleted message: ' + msg.content)
                        }
                      }
                    )
                  })
              }
            }
          )
        }
      }
    )

    log('client is ready')
  }
  
  prevMessage = {}
  prevMessageTimers = {}
  messageResponses = {}
  conversation = {}

  onMessageDeleted(channel: string | number, messageId: string | number) {
    if (
      this.messageResponses[channel] !== undefined &&
      this.messageResponses[channel][messageId] !== undefined
    ) {
      delete this.messageResponses[channel][messageId]
    }
  }

  getMessage(
    channel: { messages: { fetchMessage: (arg0: any) => any } },
    messageId: any
  ) {
    return channel.messages.fetchMessage(messageId)
  }

  isInConversation(user: string | number) {
    return (
      this.conversation[user] !== undefined &&
      this.conversation[user].isInConversation === true
    )
  }

  sentMessage(user: string) {
    for (const c in this.conversation) {
      if (c === user) continue
      if (
        this.conversation[c] !== undefined &&
        this.conversation[c].timeOutFinished === true
      ) {
        this.exitConversation(c)
      }
    }

    if (this.conversation[user] === undefined) {
      this.conversation[user] = {
        timeoutId: undefined,
        timeOutFinished: true,
        isInConversation: true,
      }
      if (this.conversation[user].timeoutId !== undefined)
        clearTimeout(this.conversation[user].timeoutId)
      this.conversation[user].timeoutId = setTimeout(() => {
        if (this.conversation[user] !== undefined) {
          this.conversation[user].timeoutId = undefined
          this.conversation[user].timeOutFinished = true
        }
      }, 480000)
    } else {
      this.conversation[user].timeoutId = setTimeout(() => {
        if (this.conversation[user] !== undefined) {
          this.conversation[user].timeoutId = undefined
          this.conversation[user].timeOutFinished = true
        }
      }, 480000)
    }
  }

  exitConversation(user: string) {
    if (this.conversation[user] !== undefined) {
      if (this.conversation[user].timeoutId !== undefined)
        clearTimeout(this.conversation[user].timeoutId)
      this.conversation[user].timeoutId = undefined
      this.conversation[user].timeOutFinished = true
      this.conversation[user].isInConversation = false
      delete this.conversation[user]
    }
  }

  getResponse(channel: string | number, message: string | number) {
    if (this.messageResponses[channel] === undefined) return undefined
    return this.messageResponses[channel][message]
  }

  async sendMessageToChannel(channelId: any, msg: any) {
    const channel = await this.client.channels.fetch(channelId)
    if (msg && msg !== '' && channel && channel !== undefined) {
      channel.send(msg)
    } else {
      console.error('could not send message to channel: ' + channelId, 'msg = ' + msg, 'channel = ' + channel)
    }
  }
}

export default DiscordConnector
