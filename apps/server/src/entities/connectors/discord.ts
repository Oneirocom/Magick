/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-const */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable require-await */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

//@ts-nocheck
// required for message.lineReply
import Discord, { Intents } from 'discord.js'
import emoji from 'emoji-dictionary'
import emojiRegex from 'emoji-regex'

// import { classifyText } from '../utils/textClassifier'
import { database } from '../../database'
import { CreateSpellHandler } from '../CreateSpellHandler'
import { initSpeechClient, recognizeSpeech } from './discord-voice'
import {
  getRandomEmptyResponse,
  startsWithCapital,
  makeGreeting,
} from './utils'

function log(...s: (string | boolean)[]) {
  console.log(...s)
}

export const channelTypes = {
  text: 'GUILD_TEXT',
  dm: 'DM',
  voice: 'GUILD_VOICE',
  thread: 'GUILD_PUBLIC_THREAD',
}
export class discord_client {
  async destroy() {
    await this.client.destroy()
    this.client = null
  }

  //Event that is triggered when a new user is added to the server
  async handleGuildMemberAdd(user: { user: { id: any; username: any } }) {
    const userName = user.user.username
    const serverName = user.guild.name

    if (this.discord_greeting) {
      const { enabled, sendIn, message, channelId } = this.discord_greeting
      if (!enabled) return
      const greeting = makeGreeting(message, { userName, serverName })
      switch (sendIn) {
        case 'dm':
          const dmChannel = await user.createDM()
          await this.sendGreetingInChannel(greeting, dmChannel)
          break
        case 'channel':
          try {
            const channel = await user.guild.channels.fetch(channelId)
            console.log('channel ::: ', channel)
            await this.sendGreetingInChannel(greeting, channel)
          } catch (e) {
            console.log('Error fetching channel ::: ', e)
          }
          break
        default:
          break
      }
    }
  }

  async sendGreetingInChannel(greeting, channel) {
    try {
      await channel.send(greeting)
      console.log('Greeting sent ::: ', greeting)
    } catch (e) {
      console.log('Error sending greeting ::: ', e)
    }
  }

  //Event that is triggered when a user is removed from the server
  async handleGuildMemberRemove(user: { user: { id: any; username: any } }) {
    const userId = user.user.id
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
    this.userUpdateSpellHandler(
      'leave',
      username,
      '',
      'Discord',
      '',
      this.entity,
      []
    )
  }

  //Event that is triggered when a user reacts to a message
  async handleMessageReactionAdd(
    reaction: { emoji?: any; message?: any },
    user: { username: string | boolean }
  ) {
    const { message } = reaction
    const emojiName = emoji.getName(reaction.emoji)
    const emojid = ':' + emojiName + ':'

    if (
      this.message_reactions[emojid] &&
      this.message_reactions[emojid] !== undefined
    ) {
      const response = await this.message_reactions[emojid](
        '',
        user.username,
        this.discord_bot_name,
        'discord',
        message.channelId,
        this.entity,
        []
      )
      if (response && response !== undefined && response?.length > 0) {
        this.client.channels.cache.get(message.channelId).send(response)
      }
    }

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
  messageCreate = async (
    client: string | boolean,
    message: string | boolean
  ) => {
    console.log('new message from discord:', message.content)

    //gets the emojis from the text and replaces to unix specific type
    const reg = emojiRegex()
    let match
    const emojis = []
    while ((match = reg.exec(message.content)) !== null) {
      emojis.push({ name: emoji.getName(match[0]), emoji: match[0] })
      message.content = message.content.replace(
        match[0],
        match[0] + ' :' + emoji.getName(match[0]) + ':'
      )
    }
    const args = {}
    args['grpc_args'] = {}

    let { author, channel, content, mentions, id } = message

    content = content.trim()
    if (
      mentions !== null &&
      mentions.members !== null &&
      mentions.members.size > 0
    ) {
      const data = content.split(' ')
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].startsWith('<@!') &&
          data[i].charAt(data[i].length - 1) === '>'
        ) {
          try {
            const x = data[i].replace('<@!', '').replace('>', '')
            const user = await this.client.users.cache.find(
              (user: { id: any }) => user.id == x
            )
            if (user !== undefined) {
              //const u = '@' + user.username + '#' + user.discriminator
              const u =
                user.id == this.client.user
                  ? this.discord_bot_name
                  : user.username
              content = content.replace(data[i], u)
            }
          } catch (err) {
            error(err)
          }
        }
      }
    }

    //replaces the discord specific mentions (<!@id>) to the actual mention
    content = content.split(' ')
    for (let i = 0; i < content.length; i++) {
      content[i] = this.getUserFromMention(content[i])
    }
    content = content.join(' ')

    if (this.discord_echo_slack && this.entity && this.entity.slack) {
      let msg = this.discord_echo_format
      if (!msg || msg?.length <= 0) {
        msg = content
      } else {
        if (msg.includes('$client')) {
          msg = msg.replace('$client', 'discord')
        } else if (msg.includes('$author')) {
          msg = msg.replace('$author', author.username)
        } else if (msg.includes('$channel')) {
          msg = msg.replace('$channel', channel.name)
        } else if (msg.includes('$message')) {
          msg = msg.replace('$message', content)
        }
      }

      if (msg && msg?.length > 0) {
        await this.entity.slack.sendMessage(
          this.entity.slack.settings.slack_echo_channel,
          msg
        )
      }
    }

    if (this.discord_echo_slack && this.entity && this.entity.slack) {
      let msg = this.discord_echo_format
      if (!msg || msg?.length <= 0) {
        msg = content
      } else {
        if (msg.includes('$client')) {
          msg = msg.replace('$client', 'discord')
        }
        if (msg.includes('$author')) {
          msg = msg.replace('$author', author.username)
        }
        if (msg.includes('$channel')) {
          msg = msg.replace('$channel', channel.name)
        }
        if (msg.includes('$message')) {
          msg = msg.replace('$message', content)
        }
      }

      if (msg && msg?.length > 0) {
        console.log('sending echo message:', msg)
        await this.entity.slack.sendMessage(
          this.entity.slack.settings.slack_echo_channel,
          msg
        )
      }
    }

    if (this.haveCustomCommands && !author.bot) {
      for (let i = 0; i < this.custom_commands.length; i++) {
        console.log(
          'command:',
          this.custom_commands[i].command_name,
          'starting_with:',
          content.startsWith(this.custom_commands[i].command_name)
        )
        if (content.startsWith(this.custom_commands[i].command_name)) {
          const _content = content
            .replace(this.custom_commands[i].command_name, '')
            .trim()
          console.log(
            'handling command:',
            this.custom_commands[i].command_name,
            'content:',
            _content
          )

          setTimeout(() => {
            channel.sendTyping()
          }, message.content.length)

          const roomInfo: {
            user: string
            inConversation: boolean
            isBot: boolean
            info3d: string
          }[] = []
          for (const [memberID, member] of channel.members) {
            roomInfo.push({
              user: member.user.username,
              inConversation: this.isInConversation(member.user.id),
              isBot: member.user.bot,
              info3d: '',
            })
          }

          const response = await this.custom_commands[i].spell_handler(
            _content,
            message.author.username,
            this.discord_bot_name,
            'discord',
            message.channel.id,
            this.entity,
            roomInfo
          )

          this.handlePingSoloAgent(
            message.channel.id,
            message.id,
            response,
            false
          )
          return
        }
      }
    }

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
    //if there are many users in the conversation simulation or the previous message is from someone else, it adds a ping
    const addPing =
      (_prev !== undefined && _prev !== '' && _prev !== author) ||
      this.moreThanOneInConversation()
    // Ignore all bots
    if (author.bot) {
      console.log('author is bot')
      return
    }
    //checks if the message contains a direct mention to the bot, or if it is a DM, or if it mentions someone else
    const botMention = `<@!${client.user}>`
    const isDM = channel.type === channelTypes['dm']
    const isMention =
      (channel.type === channelTypes['text'] && mentions.has(client.user)) ||
      isDM
    const otherMention =
      !isMention && mentions.members !== null && mentions.members.size > 0
    let startConv = false
    let startConvName = ''
    //if it isn't a mention to the bot or another mention or a DM
    //it works with the word hi and the next word should either not exist or start with a lower letter to start the conversation
    if (!isMention && !isDM && !otherMention) {
      const trimmed = content.trimStart()
      for (let i = 0; i < this.discord_starting_words.length; i++) {
        if (trimmed.toLowerCase().startsWith(this.discord_starting_words[i])) {
          const parts = trimmed.split(' ')
          if (parts.length > 1) {
            if (!startsWithCapital(parts[1])) {
              startConv = true
            } else {
              startConv = false
              startConvName = parts[1]
            }
          } else {
            if (trimmed.toLowerCase() === this.discord_starting_words[i]) {
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
    const isDirectMethion =
      !content.startsWith('!') &&
      content.toLowerCase().includes(this.bot_name?.toLowerCase())
    const isUserNameMention =
      (channel.type === channelTypes['text'] || isDM) &&
      content &&
      content
        .toLowerCase()
        .replace(',', '')
        .replace('.', '')
        .replace('?', '')
        .replace('!', '')
        .match(client.username_regex)
    const isInDiscussion = this.isInConversation(author.id)
    if (!content.startsWith('!') && !otherMention) {
      if (isMention) content = '!ping ' + content.replace(botMention, '').trim()
      else if (isDirectMethion)
        content = '!ping ' + content.replace(client.name_regex, '').trim()
      else if (isUserNameMention) {
        content = '!ping ' + content.replace(client.username_regex, '').trim()
      } else if (isInDiscussion || startConv) content = '!ping ' + content
    }

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
              if (value.author.bot) {
                agentTalked = true
              }
            }
          }
        }
      }
    }

    //if the message contains join word, it makes the bot to try to join a voice channel and listen to the users
    if (content.startsWith('!ping')) {
      this.sentMessage(author.id)
      const mention = `<@!${client.user.id}>`
      if (
        content.startsWith('!ping join') ||
        content.startsWith('!join') ||
        content.startsWith('!ping ' + mention + ' join')
      ) {
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
              type: string
              name: any
              join: () => any
              leave: () => void
            }) => {
              if (
                this.use_voice &&
                channel.type === channelTypes['voice'] &&
                channel.name === channelName
              ) {
                recognizeSpeech(channel, this.entity.id)
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

    const roomInfo: {
      user: string
      inConversation: boolean
      isBot: boolean
      info3d: string
    }[] = []
    for (const [memberID, member] of channel.members) {
      roomInfo.push({
        user: member.user.username,
        inConversation: this.isInConversation(member.user.id),
        isBot: member.user.bot,
        info3d: '',
      })
    }

    if (content.startsWith('!ping ')) {
      content = content.replace('!ping ', '')
    }

    const response = await this.handleInput(
      content,
      message.author.username,
      this.discord_bot_name,
      'discord',
      message.channel.id,
      this.entity,
      roomInfo,
      'msg'
    )

    this.handlePingSoloAgent(message.channel.id, message.id, response, false)
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
        messages.forEach(function (resp: { id: any; delete: () => void }) {
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
            messages.forEach(async function (edited: {
              id: string | boolean
              content: string | boolean
              channel: { id: string | boolean }
            }) {
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
                if (channel.type === channelTypes['thread']) {
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
                this.handleInput(
                  edited.content,
                  edited.id,
                  '',
                  'Discord',
                  edited.channel.id,
                  parentId,
                  []
                )
              }
            })
          })
      })
      .catch((err: string) => log(err + ' - ' + err.stack))
  }

  //Event that is trigger when a user's presence is changed (offline, idle, online)
  presenceUpdate = async (
    client: any,
    oldMember: { status: any },
    newMember: { status: string | boolean; userId: any }
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
            //roomManager.instance.addUser(user.id, 'discord')
          } else {
            // roomManager.instance.removeUser(user.id, 'discord')
          }
          // TODO: Replace message with direct message handler
          log('Discord', newMember.status, user.username, utcStr)
          this.userUpdateSpellHandler(
            newMember.status,
            user.username,
            '',
            'Discord',
            '',
            this.entity,
            []
          )
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
              type: string
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
                channel.type === channelTypes['text'] &&
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
                this.metadataSpellHandler(
                  channel.topic || 'none',
                  '',
                  '',
                  'Discord',
                  channel.id,
                  this.entity,
                  []
                )
                channel.messages
                  .fetch({ limit: 100 })
                  .then(async (messages: any[]) => {
                    messages.forEach(async function (msg: {
                      author: { username: string; isBot: any }
                      deleted: boolean
                      content: string
                      id: any
                      createdTimestamp: any
                    }) {
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
                      } else
                        await wasHandled(
                          channel.id,
                          msg.id,
                          _author,
                          msg.content,
                          msg.createdTimestamp
                        )
                    })
                  })
              }
            }
          )
        }
      }
    )

    log('client is ready')
  }

  embedColor = '#000000'
  _commandToValue = ([name, args, description]) =>
    ['.' + name, args.join(' '), '-', description].join(' ')
  _commandToDescription = ([name, args, description]) =>
    '```css\n' +
    ['.' + name, args.join(' '), '-', description].join(' ') +
    '```'
  _commandsToValue = (commands: any[]) =>
    '```css\n' +
    commands
      .map((command: [any, any, any]) => this._commandToValue(command))
      .join('\n') +
    '```'

  helpFields = [
    {
      name: 'Tweak',
      shortname: 'tweak',
      commands: [
        [
          'ping',
          ['HandleMessage'],
          ['sender', 'message', 'client_name', 'chat_id'],
          'ping all agents',
        ],
        [
          'slash_command',
          ['HandleSlashCommand'],
          ['sender', 'command', 'args', 'client_name', 'chat_id', 'createdAt'],
          'handle slash command',
        ],
        [
          'user_update',
          ['HandleUserUpdate'],
          ['username', 'event', 'createdAt'],
          'handle user update',
        ],
        [
          'message_reaction',
          ['HandleMessageReaction'],
          [
            'client_name',
            'chat_id',
            'message_id',
            'content',
            'user',
            'reaction',
            'createdAt',
          ],
          'handle message reaction',
        ],
        [
          'pingagent',
          ['InvokeSoloAgent'],
          ['sender', 'message', 'agent', 'createdAt'],
          'ping a single agent',
        ],
        ['agents', ['GetAgents'], [''], 'show all selected agents'],
        [
          'setagent',
          ['SetAgentFields'],
          ['name', 'context'],
          'update agents parameters',
        ],
        ['commands', [''], [''], 'Shows all available commands'],
      ],
      value: '',
    },
  ].map(o => {
    o.value = this._commandsToValue(o.commands)
    return o
  })

  _findCommand = (commandName: any) => {
    let command = null
    for (const helpField of helpFields) {
      for (const c of helpField.commands) {
        const [name, args, description] = c
        if (name === commandName) {
          command = c
          break
        }
      }
      if (command !== null) {
        break
      }
    }
    return command
  }

  _parseWords = (s: string) => {
    const words = []
    const r = /\S+/g
    let match
    while ((match = r.exec(s))) {
      words.push(match)
    }
    return words
  }

  replacePlaceholders(text: string | undefined) {
    if (text === undefined || text === '') return ''

    if (text.includes('{time_now}')) {
      const now = new Date()
      const time =
        now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
      text = text.replace('{time_now}', time)
    }
    if (text.includes('{date_now}')) {
      const today = new Date()
      const date =
        today.getDay() + '/' + today.getMonth() + '/' + today.getFullYear()
      text = text.replace('{date_now}', date)
    }
    if (text.includes('{year_now}')) {
      text = text.replace('{year_now', new Date().getFullYear().toString())
    }
    if (text.includes('{month_now}')) {
      text = text.replace('{month_now}', new Date().getMonth().toString())
    }
    if (text.includes('{day_now}')) {
      text = text.replace('{day_now}', new Date().getDay().toString())
    }
    if (text.includes('{name}')) {
      text = text.replace('{name}', this.bot_name)
    }

    return text
  }

  async sendSlashCommandResponse(
    client: any,
    interaction: { id: any; token: any },
    chat_id: any,
    text: any
  ) {
    this.client.api
      .interactions(interaction.id, interaction.token)
      .callback.post({
        data: {
          type: 4,
          data: {
            content: text,
          },
        },
      })
      .catch(console.error)
  }

  async handleSlashCommand(
    client: any,
    interaction: {
      data: { name: string; options: { value: string | boolean }[] }
      member: { user: { username: string } }
      channel_id: string
    }
  ) {
    const command = interaction.data.name.toLowerCase()
    const sender = interaction.member.user.username + ''
    const chatId = interaction.channel_id + ''

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
    // TODO: Replace message with direct message handler
    log(
      sender,
      command,
      command === 'say' ? interaction.data.options[0].value : 'none',
      'Discord',
      chatId,
      utcStr
    )
    this.sendSlashCommandResponse(
      command === 'say' ? interaction.data.options[0].value : 'none',
      command,
      sender,
      'Discord',
      chatId,
      this.entity,
      []
    )
  }

  async handleSlashCommandResponse(chat_id: any, response: any) {
    this.client.channels
      .fetch(chat_id)
      .then(
        (channel: { send: (arg0: any) => void; stopTyping: () => void }) => {
          channel.send(response)
          channel.stopTyping()
        }
      )
      .catch((err: string | boolean) => log(err))
  }

  async handleUserUpdateEvent(response: string) {
    log('handleUserUpdateEvent: ' + response)
  }

  async handlePingSoloAgent(
    chat_id: any,
    message_id: any,
    responses: string | boolean | any[] | undefined,
    addPing: boolean
  ) {
    this.client.channels
      .fetch(chat_id)
      .then((channel: { messages: { fetch: (arg0: any) => Promise<any> } }) => {
        channel.messages.fetch(message_id).then(
          (message: {
            reply: (arg0: string) => Promise<any>
            channel: {
              send: (
                arg0: string,
                arg1: { split: boolean } | undefined
              ) => Promise<any>
            }
          }) => {
            log('response:', responses)
            if (responses && (responses as string).includes('uberduck')) {
              if (addPing) {
                message.reply({
                  files: [{ attachment: responses, name: 'voice.wav' }],
                })
                return
              } else {
                message.channel.send('', {
                  files: [{ attachment: responses, name: 'voice.wav' }],
                })
                return
              }
            } else {
              if (
                responses !== undefined &&
                responses.length <= 2000 &&
                responses.length > 0
              ) {
                let text = this.replacePlaceholders(responses)
                if (addPing) {
                  message
                    .reply(text)
                    .then(async function (msg: any) {
                      //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                    })
                    .catch(console.error)
                } else {
                  while (
                    text === undefined ||
                    text === '' ||
                    text.replace(/\s/g, '').length === 0
                  )
                    text = getRandomEmptyResponse()
                  log('response1: ' + text)
                  message.channel
                    .send(text)
                    .then(async function (msg: any) {
                      //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                    })
                    .catch(console.error)
                }
              } else if (
                responses &&
                responses !== undefined &&
                responses.length >= 2000
              ) {
                let text = this.replacePlaceholders(responses)
                if (addPing) {
                  message.reply(text).then(async function (msg: any) {
                    //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                  })
                } else {
                  while (
                    text === undefined ||
                    text === '' ||
                    text.replace(/\s/g, '').length === 0
                  )
                    text = getRandomEmptyResponse(this.discord_empty_responses)
                  log('response2: ' + text)
                }
                if (text.length > 0) {
                  message.channel
                    .send(text, { split: true })
                    .then(async function (msg: any) {
                      //this.onMessageResponseUpdated(channel.id, message.id, msg.id)
                    })
                }
              } else {
                const emptyResponse = getRandomEmptyResponse(
                  this.discord_empty_responses
                )
                log('sending empty response 1: ' + emptyResponse)
                if (
                  emptyResponse !== undefined &&
                  emptyResponse !== '' &&
                  emptyResponse.replace(/\s/g, '').length !== 0
                ) {
                  let text = emptyResponse
                  if (addPing) {
                    message
                      .reply(text)
                      .then(async function (msg: any) {
                        //this.onMessageResponseUpdated(
                        //  channel.id,
                        //  message.id,
                        //  msg.id
                        //)
                      })
                      .catch(console.error)
                  } else {
                    while (
                      text === undefined ||
                      text === '' ||
                      text.replace(/\s/g, '').length === 0
                    )
                      text = getRandomEmptyResponse(
                        this.discord_empty_responses
                      )
                    log('response4: ' + text)
                    message.channel
                      .send(text)
                      .then(async function (msg: any) {
                        //this.onMessageResponseUpdated(
                        //  channel.id,
                        //  message.id,
                        //  msg.id
                        //)
                      })
                      .catch(console.error)
                  }
                }
              }
            }
          }
        )
      })
      .catch((err: string | boolean) => log(err))
  }

  async handleMessageEdit(
    message_id: any,
    chat_id: any,
    responses: string | any[] | undefined,
    addPing: any
  ) {
    this.client.channels
      .fetch(chat_id)
      .then(
        async (channel: {
          id: any
          messages: { fetch: (arg0: { limit: any }) => Promise<any> }
        }) => {
          const oldResponse = getResponse(channel.id, message_id)
          if (oldResponse === undefined) {
            return
          }

          channel.messages
            .fetch(oldResponse)
            .then(async (msg: { edit: (arg0: string) => void; id: any }) => {
              channel.messages
                .fetch({ limit: this.client.edit_messages_max_count })
                .then(async (messages: any[]) => {
                  messages.forEach(async function (edited: {
                    id: any
                    channel: {
                      send: (
                        arg0: any,
                        arg1: { split: boolean }
                      ) => Promise<any>
                      stopTyping: () => void
                    }
                  }) {
                    if (edited.id === message_id) {
                      Object.keys(responses).map(async function (key, index) {
                        log('response: ' + responses)
                        log('response: ' + key)
                        log('response: ' + index)

                        if (
                          responses !== undefined &&
                          responses.length <= 2000 &&
                          responses.length > 0
                        ) {
                          let text = replacePlaceholders(responses)
                          while (
                            text === undefined ||
                            text === '' ||
                            text.replace(/\s/g, '').length === 0
                          )
                            text = getRandomEmptyResponse(
                              this.discord_empty_responses
                            )
                          log('response1: ' + text)
                          msg.edit(text)
                          onMessageResponseUpdated(
                            channel.id,
                            edited.id,
                            msg.id
                          )
                        } else if (responses.length >= 2000) {
                          let text = replacePlaceholders(responses)
                          while (
                            text === undefined ||
                            text === '' ||
                            text.replace(/\s/g, '').length === 0
                          )
                            text = getRandomEmptyResponse(
                              this.discord_empty_responses
                            )
                          log('response2: ' + text)

                          if (text.length > 0) {
                            edited.channel
                              .send(text, { split: true })
                              .then(async function (msg: { id: any }) {
                                onMessageResponseUpdated(
                                  channel.id,
                                  edited.id,
                                  msg.id
                                )
                              })
                          }
                        } else {
                          const emptyResponse = getRandomEmptyResponse(
                            this.discord_empty_responses
                          )
                          log('sending empty response 2: ' + emptyResponse)
                          if (
                            emptyResponse !== undefined &&
                            emptyResponse !== '' &&
                            emptyResponse.replace(/\s/g, '').length !== 0
                          ) {
                            let text = emptyResponse
                            while (
                              text === undefined ||
                              text === '' ||
                              text.replace(/\s/g, '').length === 0
                            )
                              text = getRandomEmptyResponse(
                                this.discord_empty_responses
                              )
                            log('response4: ' + text)
                            msg.edit(text)
                            onMessageResponseUpdated(
                              channel.id,
                              edited.id,
                              msg.id
                            )
                          }
                        }
                      })
                      edited.channel.stopTyping()
                    }
                  })
                })
                .catch((err: string | boolean) => log(err))
            })
        }
      )
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
  onMessageResponseUpdated(
    channel: string | number,
    messageId: string | number,
    newResponse: any
  ) {
    if (this.messageResponses[channel] === undefined)
      this.messageResponses[channel] = {}
    this.messageResponses[channel][messageId] = newResponse
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

  moreThanOneInConversation() {
    let count = 0
    for (const c in this.conversation) {
      if (this.conversation[c] === undefined) continue
      if (
        this.conversation[c].isInConversation !== undefined &&
        this.conversation[c].isInConversation === true &&
        this.conversation[c].timeOutFinished === false
      )
        count++
    }

    return count > 1
  }

  client = Discord.Client as any
  entity = undefined
  handleInput = null
  userUpdateSpellHandler = null
  metadataSpellHandler = null
  slashCommandSpellHandler = null
  discord_starting_words: string[] = []
  discord_bot_name_regex: string = ''
  discord_bot_name: string = 'Bot'
  discord_empty_responses: string[] = []
  discord_greeting: any
  use_voice: boolean
  voice_provider: string
  voice_character: string
  voice_language_code: string
  discord_echo_slack: boolean
  discord_echo_format: string
  haveCustomCommands: boolean
  custom_commands: any[]
  message_reactions: { [reaction: string]: any } = {}
  tiktalknet_url: string
  discord_echo_slack: boolean
  discord_echo_format: string
  createDiscordClient = async (
    entity: any,
    discord_api_token: string | undefined,
    discord_starting_words: string,
    discord_bot_name_regex: string,
    discord_bot_name: string | RegExp,
    discord_empty_responses: string,
    discord_greeting: any,
    handleInput: (
      message: string | undefined,
      speaker: string,
      agent: string,
      client: string,
      channelId: string,
      entity: number,
      roomInfo: {
        user: string
        inConversation: boolean
        isBot: boolean
        info3d: string
      }[],
      channel: string
    ) => Promise<unknown>,
    userUpdateSpellHandler: any,
    metadataSpellHandler: any,
    slashCommandSpellHandler: any,
    use_voice,
    voice_provider,
    voice_character,
    voice_language_code,
    haveCustomCommands: boolean,
    custom_commands: any[],
    tiktalknet_url: string,
    discord_echo_slack: boolean,
    discord_echo_format: string
  ) => {
    console.log('creating discord client')
    this.entity = entity
    this.discord_greeting = discord_greeting
    this.handleInput = handleInput
    this.userUpdateSpellHandler = userUpdateSpellHandler
    this.metadataSpellHandler = metadataSpellHandler
    this.slashCommandSpellHandler = slashCommandSpellHandler
    this.use_voice = use_voice
    this.voice_provider = voice_provider
    this.voice_character = voice_character
    this.voice_language_code = voice_language_code
    this.discord_echo_slack = discord_echo_slack
    this.discord_echo_format = discord_echo_format
    this.haveCustomCommands = haveCustomCommands
    this.custom_commands = custom_commands
    this.tiktalknet_url = tiktalknet_url
    this.discord_echo_slack = discord_echo_slack
    this.discord_echo_format = discord_echo_format
    if (!discord_starting_words || discord_starting_words?.length <= 0) {
      this.discord_starting_words = ['hi', 'hey']
    } else {
      this.discord_starting_words = discord_starting_words?.split(',')
      for (let i = 0; i < this.discord_starting_words.length; i++) {
        this.discord_starting_words[i] = this.discord_starting_words[i]
          .trim()
          .toLowerCase()
      }
    }
    if (!discord_empty_responses || discord_empty_responses?.length <= 0) {
      this.discord_empty_responses = ["I can't understand you"]
    } else {
      this.discord_empty_responses = discord_empty_responses?.split(',')
      for (let i = 0; i < this.discord_empty_responses.length; i++) {
        this.discord_empty_responses[i] = this.discord_empty_responses[i]
          .trim()
          .toLowerCase()
      }
    }

    const reaction_handlers = await database.instance.getMessageReactions()
    this.setupMessageReactions(reaction_handlers)
    setInterval(async () => {
      const reactionhandlers = await database.instance.getMessageReactions()
      this.setupMessageReactions(reactionhandlers)
    }, 5000)

    this.discord_bot_name_regex = discord_bot_name_regex
    this.discord_bot_name = discord_bot_name

    const token = discord_api_token ?? process.env.DISCORD_API_TOKEN
    if (!token) return console.warn('No API token for Discord bot, skipping')

    this.client = new Discord.Client({
      partials: ['MESSAGE', 'USER', 'REACTION', 'CHANNEL'],
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ],
    })
    this.bot_name = discord_bot_name
    this.client.prefix = '!'
    this.client.prefixOptionalWhenMentionOrDM = true

    this.client.on('debug', message => {
      console.log('debug', message)
    })

    //{ intents: [ Intents.GUILDS, Intents.GUILD_MEMBERS, Intents.GUILD_VOICE_STATES, Intents.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
    // We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
    this.client.helpFields = this.helpFields
    this.client._findCommand = this._findCommand
    this.client._parseWords = this._parseWords
    this.client.name_regex = new RegExp(discord_bot_name, 'ig')

    this.client.username_regex = new RegExp(this.discord_bot_name_regex, 'ig') //'((?:digital|being)(?: |$))'
    this.client.edit_messages_max_count = 5

    const embed = new Discord.MessageEmbed().setColor(0x00ae86)

    this.client.embed = embed

    if (this.use_voice) {
      initSpeechClient(
        this.client,
        this.discord_bot_name,
        this.entity,
        this.handleInput,
        this.voice_provider,
        this.voice_character,
        this.voice_language_code,
        this.tiktalknet_url
      )
    }

    console.log('registering events')
    this.client.on('messageCreate', this.messageCreate.bind(null, this.client))
    // this.client.on('messageDelete', this.messageDelete.bind(null, this.client))
    // this.client.on('messageUpdate', this.messageUpdate.bind(null, this.client))
    // this.client.on(
    //   'presenceUpdate',
    //   this.presenceUpdate.bind(null, this.client)
    // )

    this.client.on(
      'interactionCreate',
      async (interaction: string | boolean) => {
        log('Handling interaction', interaction)
        this.handleSlashCommand(client, interaction)
      }
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

    // this.client.commands = new Discord.Collection()

    // this.client.commands.set('agents', this.agents)
    // this.client.commands.set('ban', this.ban)
    // this.client.commands.set('commands', this.commands)
    // this.client.commands.set('ping', this.ping)
    // this.client.commands.set('pingagent', this.pingagent)
    // this.client.commands.set('setagent', this.setagent)
    // this.client.commands.set('setname', this.setname)
    // this.client.commands.set('unban', this.unban)

    // setInterval(() => {
    //   const channelIds: any[] = []

    //   this.client.channels.cache.forEach(async (channel: { topic: string | undefined; id: string | number } | undefined) => {
    //     if (!channel || !channel.topic) return
    //     if (channel === undefined || channel.topic === undefined) return
    //     if (
    //       channel.topic.length < 0 ||
    //       channel.topic.toLowerCase() !== 'daily discussion'
    //     )
    //       return
    //     if (channelIds.includes(channel.id)) return

    //     channelIds.push(channel.id)
    //     if (
    //       this.discussionChannels[channel.id] === undefined ||
    //       !this.discussionChannels
    //     ) {
    //       this.discussionChannels[channel.id] = {
    //         timeout: setTimeout(() => {
    //           delete this.discussionChannels[channel.id]
    //         }, 1000 * 3600 * 4),
    //         responded: false,
    //       }
    //       // const resp = await handleInput(
    //       //   'Tell me about ' + 'butterlifes',
    //       //   'bot',
    //       //    this.discord_bot_name ?? 'Agent',
    //       //   'discord',
    //       //   message.channel.id,
    //       //   this.spell_handler,
    //       //   this.spell_version
    //       // )
    //       // channel.send(resp)
    //     }
    //   })
    // }, 1000 * 3600)

    this.client.login(token)
  }

  discussionChannels = {}

  async sendMessageToChannel(channelId: any, msg: any) {
    const channel = await this.client.channels.fetch(channelId)
    if (channel && channel !== undefined) {
      channel.send(msg)
    }
  }

  prevData = []
  async setupMessageReactions(data: any) {
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].discord_enabled === 'true' &&
        !this.messageReactionUpdate(data[i])
      ) {
        this.message_reactions[data[i].reaction] = await CreateSpellHandler({
          spell: data[i].spell_handler,
          version: 'latest',
        })
      }
      this.prevData = data
    }
  }
  messageReactionUpdate(datai: any) {
    for (let i = 0; i < this.prevData.length; i++) {
      if (
        this.prevData[i].reaction === datai.reaction &&
        this.prevData[i].discord_enabled === datai.discord_enabled &&
        this.prevData[i].spell_handler === datai.spell_handler
      ) {
        return true
      }

      return false
    }
  }
}

export default discord_client
