/* eslint-disable require-await */
/* eslint-disable no-invalid-this */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import WhatsAppBot from '@green-api/whatsapp-bot'
import { database } from './database'
import { getRandomEmptyResponse, getSetting, startsWithCapital } from './utils'

export class whatsapp_client {
  //TODO: Needs tests - misses API key (needs request from whatsapp)
  async onMessage(msg) {
    const date = Date.now() / 1000
    const msgDate = msg.date
    const diff = date - msgDate
    const hours_diff = Math.ceil(diff / 3600)
    const mins_diff = Math.ceil((diff - hours_diff) / 60)
    if (mins_diff > 12 || (mins_diff <= 12 && hours_diff > 1)) return

    let content = msg.text
    const _sender =
      msg.from.username === undefined ? msg.from.first_name : msg.from.username
    this.addMessageToHistory(msg.chat.id, msg.message_id, _sender, content)
    let addPing = false
    if (msg.chat.type == 'supergroup') {
      if (content === '') content = '{sent media}'
      let isReply = false
      if (msg.reply_to_message !== undefined) {
        if (msg.reply_to_message.from.username === this.botName) isReply = true
        else {
          this.exitConversation(_sender)
          const _replyTo =
            msg.reply_to_message.from.username === undefined
              ? msg.reply_to_message.from.first_name
              : msg.reply_to_message.from.username
          this.exitConversation(_replyTo)
          return
        }
      }
      let _prev = undefined
      if (!msg.from.is_bot) {
        _prev = this.prevMessage[msg.chat.id]
        this.prevMessage[msg.chat.id] = _sender
        if (this.prevMessageTimers[msg.chat.id] !== undefined)
          clearTimeout(this.prevMessageTimers[msg.chat.id])
        this.prevMessageTimers[msg.chat.id] = setTimeout(
          () => (this.prevMessage[msg.chat.id] = ''),
          120000
        )
      }
      addPing = _prev !== undefined && _prev !== '' && _prev !== _sender

      const isMention =
        msg.entities !== undefined &&
        msg.entities.length === 1 &&
        msg.entities[0].type === 'mention' &&
        content.includes('@' + this.botName)
      const otherMention =
        msg.entities !== undefined &&
        msg.entities.length > 0 &&
        msg.entities[0].type === 'mention' &&
        !content.includes('@' + this.botName)
      let startConv = false
      let startConvName = ''
      if (!isMention && !otherMention) {
        const trimmed = content.trimStart()
        if (trimmed.toLowerCase().startsWith('hi')) {
          const parts = trimmed.split(' ')
          if (parts.length > 1) {
            if (!startsWithCapital(parts[1])) {
              startConv = true
            } else {
              startConv = false
              startConvName = parts[1]
            }
          } else {
            if (trimmed.toLowerCase() === 'hi') {
              startConv = true
            }
          }
        }
      }
      if (otherMention) {
        this.exitConversation(_sender)
        for (let i = 0; i < msg.entities.length; i++) {
          if (msg.entities[i].type === 'mention') {
            const _user = msg.text.slice(
              msg.entities[i].offset + 1,
              msg.entities[i].length
            )
            this.exitConversation(_user)
          }
        }
      }
      if (!startConv) {
        if (startConvName.length > 0) {
          this.exitConversation(_sender)
          this.exitConversation(startConvName)
        }
      }

      const isUserNameMention = content.toLowerCase().match(username_regex)
      const isInDiscussion = this.isInConversation(_sender)
      if (!content.startsWith('!') && !otherMention) {
        if (isMention) content = '!ping ' + content.replace('!', '').trim()
        else if (isUserNameMention)
          content = '!ping ' + content.replace(username_regex, '').trim()
        else if (isInDiscussion || startConv || isReply)
          content = '!ping ' + content
      }

      if (!otherMention && content.startsWith('!ping'))
        this.sentMessage(_sender)
    } else {
      content = '!ping ' + content
    }

    if (content === '!ping ' || !content.startsWith('!ping')) return

    const args = {}
    args['grpc_args'] = {}

    args['parsed_words'] = content.slice('!'.length).trim().split(/ +/g)

    args['command_info'] = [
      'ping',
      ['HandleMessage'],
      ['sender', 'message'],
      'ping all agents',
    ]
    args['grpc_args']['sender'] = _sender
    if (args['command_info']) {
      args['command'] = args['command_info'][0]
      args['grpc_args']['message'] = content.replace('!' + args['command'], '')
      args['grpc_method'] = args['command_info'][1][0]
      args['grpc_method_params'] = args['command_info'][2]
    }

    args['chat_history'] = await this.getChatHistory(msg.chat.id, 10)
    await messageResponseHandler(args, async response => {
      log(JSON.stringify(response))
      Object.keys(response.response).map(function (key, index) {
        log('response: ' + response.response[key])
        if (
          response.response[key] !== undefined &&
          response.response[key].length <= 2000 &&
          response.response[key].length > 0
        ) {
          let text = response.response[key]
          while (
            text === undefined ||
            text === '' ||
            text.replace(/\s/g, '').length === 0
          )
            text = getRandomEmptyResponse()
          if (addPing)
            msg
              .reply(
                msg.chat.id,
                `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a> ${text}`,
                { parse_mode: 'HTML' }
              )
              .then(function (_resp) {
                this.onMessageResponseUpdated(
                  _resp.chat.id,
                  msg.message_id,
                  _resp.message_id
                )
                this.addMessageToHistory(
                  _resp.chat.id,
                  _resp.message_id,
                  this.botName,
                  text
                )
              })
              .catch(console.error)
          else
            msg
              .reply(msg.chat.id, text)
              .then(function (_resp) {
                this.onMessageResponseUpdated(
                  _resp.chat.id,
                  msg.message_id,
                  _resp.message_id
                )
                this.addMessageToHistory(
                  _resp.chat.id,
                  _resp.message_id,
                  this.botName,
                  text
                )
              })
              .catch(console.error)
        } else if (response.response[key].length > 2000) {
          const lines = []
          let line = ''
          for (let i = 0; i < response.response[key].length; i++) {
            line += response.response[key]
            if (i >= 1980 && (line[i] === ' ' || line[i] === '')) {
              lines.push(line)
              line = ''
            }
          }

          for (let i = 0; i < lines.length; i++) {
            if (
              lines[i] !== undefined &&
              lines[i] !== '' &&
              lines[i].replace(/\s/g, '').length !== 0
            ) {
              if (i === 0) {
                let text = lines[1]
                while (
                  text === undefined ||
                  text === '' ||
                  text.replace(/\s/g, '').length === 0
                )
                  text = getRandomEmptyResponse()
                if (addPing)
                  msg
                    .reply(
                      msg.chat.id,
                      `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a> ${text}`,
                      { parse_mode: 'HTML' }
                    )
                    .then(function (_resp) {
                      this.onMessageResponseUpdated(
                        _resp.chat.id,
                        msg.message_id,
                        _resp.message_id
                      )
                      this.addMessageToHistory(
                        _resp.chat.id,
                        _resp.message_id,
                        this.botName,
                        text
                      )
                    })
                    .catch(console.error)
                else
                  msg
                    .reply(msg.chat.id, text)
                    .then(function (_resp) {
                      this.onMessageResponseUpdated(
                        _resp.chat.id,
                        msg.message_id,
                        _resp.message_id
                      )
                      this.addMessageToHistory(
                        _resp.chat.id,
                        _resp.message_id,
                        this.botName,
                        text
                      )
                    })
                    .catch(console.error)
              }
            }
          }
        } else {
          let emptyResponse = getRandomEmptyResponse()
          while (
            emptyResponse === undefined ||
            emptyResponse === '' ||
            emptyResponse.replace(/\s/g, '').length === 0
          )
            emptyResponse = getRandomEmptyResponse()
          if (addPing)
            msg
              .reply(
                msg.chat.id,
                `<a href="tg://user?id=${msg.from.id}">${msg.from.first_name}</a> ${emptyResponse}`,
                { parse_mode: 'HTML' }
              )
              .then(function (_resp) {
                this.onMessageResponseUpdated(
                  _resp.chat.id,
                  msg.message_id,
                  _resp.message_id
                )
                this.addMessageToHistory(
                  _resp.chat.id,
                  _resp.message_id,
                  this.botName,
                  emptyResponse
                )
              })
              .catch(console.error)
          else
            msg
              .reply(msg.chat.id, emptyResponse)
              .then(function (_resp) {
                this.onMessageResponseUpdated(
                  _resp.chat.id,
                  msg.message_id,
                  _resp.message_id
                )
                this.addMessageToHistory(
                  _resp.chat.id,
                  _resp.message_id,
                  this.botName,
                  emptyResponse
                )
              })
              .catch(console.error)
        }
      })
    }).catch(err => log(err))
  }

  prevMessage = {}
  prevMessageTimers = {}
  messageResponses = {}
  conversation = {}
  chatHistory = {}

  onMessageDeleted(chatId, messageId) {
    if (
      this.messageResponses[chatId] !== undefined &&
      this.messageResponses[chatId][messageId] !== undefined
    ) {
      delete this.messageResponses[chatId][messageId]
    }
  }
  onMessageResponseUpdated(chatId, messageId, newResponse) {
    if (this.messageResponses[chatId] === undefined)
      this.messageResponses[chatId] = {}
    this.messageResponses[chatId][messageId] = newResponse
  }

  getMessage(chatId, messageId) {
    return chatId.messages.fetchMessage(messageId)
  }

  isInConversation(user) {
    return this.conversation[user] !== undefined
  }

  sentMessage(user) {
    if (this.conversation[user] !== undefined) {
      clearTimeout(this.conversation[user])
    }

    this.conversation[user] = setTimeout(function () {
      this.conversation[user] = undefined
    }, 120000)
  }

  exitConversation(user) {
    if (this.conversation[user] !== undefined) {
      clearTimeout(this.conversation[user])
      this.conversation[user] = undefined
    }
  }

  getResponse(chatId, message) {
    if (this.messageResponses[chatId] === undefined) return undefined
    return this.messageResponses[chatId][message]
  }

  async addMessageToHistory(chatId, messageId, senderName, content) {
    await database.instance.addMessageInHistory(
      'whatsapp',
      chatId,
      messageId,
      senderName,
      content
    )
  }
  async getChatHistory(chatId, length) {
    return []
    // return await database.instance.getHistory(length, 'whatsapp', chatId)
  }
  async updateMessage(chatId, messageId, newContent) {
    // await database.instance.updateMessage(
    //   'whatsapp',
    //   chatId,
    //   messageId,
    //   newContent,
    //   true
    // )
  }
  // replace with configurable regex later
  username_regex = new RegExp('((?:digital|being)(?: |$))', 'ig')
  botName
  agent
  settings

  createWhatsappClient = async (agent, settings) => {
    this.agent = agent
    this.settings = settings
    this.botName = getSetting(settings, 'whatsappBotName')

    const token = getSetting(settings, 'whatsappToken')
    if (!token) return console.warn('No API token for Whatsapp bot, skipping')
    const bot = new WhatsAppBot(token)

    bot.on('message', async msg => {
      log(JSON.stringify(msg))
      await this.onMessage(msg)
    })
    bot.launch()
  }
}
