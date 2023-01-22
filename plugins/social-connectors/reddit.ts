/* eslint-disable no-prototype-builtins */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import SnooStream from 'snoostream'
import * as snoowrap from 'snoowrap'

export let reddit

export const prevMessage = {}
export const prevMessageTimers = {}
export const messageResponses = {}
export const conversation = {}

export class reddit_client {
  reddit
  prevMessage = {}
  prevMessageTimers = {}
  messageResponses = {}
  conversation = {}

  onMessageDeleted(channel, messageId) {
    if (
      this.messageResponses[channel] !== undefined &&
      this.messageResponses[channel][messageId] !== undefined
    ) {
      delete this.messageResponses[channel][messageId]
    }
  }
  onMessageResponseUpdated(channel, messageId, newResponse) {
    if (this.messageResponses[channel] === undefined)
      this.messageResponses[channel] = {}
    this.messageResponses[channel][messageId] = newResponse
  }

  getMessage(channel, messageId) {
    return channel.messages.fetchMessage(messageId)
  }

  isInConversation(user) {
    return (
      this.conversation[user] !== undefined &&
      this.conversation[user].isInConversation === true
    )
  }

  sentMessage(user) {
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

  exitConversation(user) {
    if (this.conversation[user] !== undefined) {
      if (this.conversation[user].timeoutId !== undefined)
        clearTimeout(this.conversation[user].timeoutId)
      this.conversation[user].timeoutId = undefined
      this.conversation[user].timeOutFinished = true
      this.conversation[user].isInConversation = false
      delete this.conversation[user]
    }
  }

  getResponse(channel, message) {
    if (this.messageResponses[channel] === undefined) return undefined
    return this.messageResponses[channel][message]
  }

  async handleMessage(response, messageId, chat_id, args, reddit) {
    if (args === 'isChat') {
      this.reddit.getMessage(messageId).reply(responses[key])
    } else if (args === 'isPost') {
      this.reddit.getSubmission(chat_id).reply(responses[key])
    }
  }

  spellHandler
  settings
  entity
  haveCustomCommands
  custom_commands

  createRedditClient = async (spellHandler, settings, entity) => {
    this.spellHandler = spellHandler
    this.settings = settings
    this.entity = entity
    this.haveCustomCommands = settings.haveCustomCommands
    this.custom_commands = settings.custom_commands

    const appId = settings.reddit_app_id
    const appSecredId = settings.reddit_app_secret_id
    const oauthToken = setting.reddit_oauth_token
    //https://github.com/not-an-aardvark/reddit-oauth-helper
    if (!appId || !appSecredId)
      return console.warn('No API token for Reddit bot, skipping')

    const snooWrapOpptions = {
      continueAfterRatelimitError: true,
      requestDelay: 1100,
    }

    this.reddit = new snoowrap({
      userAgent: 'test_db_app',
      clientId: appId,
      clientSecret: appSecredId,
      refreshToken: oauthToken,
    })
    this.reddit.config(snooWrapOpptions)
    const stream = new SnooStream(reddit)
    log('loaded reddit client')

    const regex = new RegExp(settings.reddit_bot_name_regex, 'ig')

    const commentStream = stream.commentStream('test_db')
    commentStream.on('post', async (post, match) => {
      let _match
      if (post.hasOwnProperty('body')) {
        _match = post.body.match(regex)
      } else if (post.hasOwnProperty('selftext')) {
        _match = post.selftext.match(regex)
      }

      if (_match) {
        log('got new commend') // - ' + JSON.stringify(post))
        const id = post.id
        const chat_id = post.link_url.split('/')[6]
        const author = post.author.name
        const body = post.body
        const resp = await this.spellHandler(
          body,
          author ?? 'Sender',
          this.settings.reddit_bot_name ?? 'Agent',
          'reddit',
          chat_id,
          this.entity,
          [],
          'msg'
        )
        await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
      } else {
        log('got new commend')
        const id = post.id
        const chat_id = post.link_url.split('/')[6]
        const author = post.author
        const body = post.body
        const resp = await this.spellHandler(
          body,
          author ?? 'Sender',
          this.settings.reddit_bot_name ?? 'Agent',
          'reddit',
          chat_id,
          this.entity,
          [],
          'msg'
        )
        await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
      }
    })
    const submissionStream = stream.submissionStream('test_db', {
      regex: settings.reddit_bot_name_regex,
    })
    submissionStream.on('post', async (post, match) => {
      let _match
      if (post.hasOwnProperty('body')) {
        _match = post.body.match(regex)
      } else if (post.hasOwnProperty('selftext')) {
        _match = post.selftext.match(regex)
      }

      if (_match) {
        log('got new post' + JSON.stringify(post))
        const id = post.id
        const chat_id = post.id
        const author = post.author.name
        const body = post.selftext
        const resp = await this.spellHandler(
          body,
          author ?? 'Sender',
          this.settings.reddit_bot_name ?? 'Agent',
          'reddit',
          chat_id,
          this.entity,
          [],
          'msg'
        )
        await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
      } else {
        log('got new post') // - ' + JSON.stringify(post))
        const id = post.id
        const chat_id = post.id
        const author = post.author
        const body = post.selftext
        const resp = await this.spellHandler(
          body,
          author ?? 'Sender',
          this.settings.reddit_bot_name ?? 'Agent',
          'reddit',
          chat_id,
          this.entity,
          [],
          'msg'
        )
        await this.handleMessage(resp, id, chat_id, 'isPost', reddit)
      }
    })

    setInterval(async () => {
      ;(await reddit.getInbox()).forEach(async message => {
        const id = message.name
        const author = message.author.name
        const body = message.body
        if (!author.includes('reddit')) {
          log('got new message: ' + body)

          if (this.haveCustomCommands) {
            for (let i = 0; i < this.custom_commands[i].length; i++) {
              if (body.startsWith(this.custom_commands[i].command_name)) {
                const _content = body.replace(
                  this.custom_commands[i].command_name,
                  ''
                )

                const response = await this.custom_commands[i].spell_handler(
                  _content,
                  author ?? 'Sender',
                  this.settings.reddit_bot_name ?? 'Agent',
                  'reddit',
                  chat_id,
                  this.entity,
                  []
                )

                await this.handleMessage(
                  response,
                  id,
                  chat_id,
                  'isChat',
                  reddit
                )
                return
              }
            }
          }

          const resp = await this.spellHandler(
            body,
            author ?? 'Sender',
            this.settings.reddit_bot_name ?? 'Agent',
            'reddit',
            chat_id,
            this.entity,
            [],
            'msg'
          )
          await this.handleMessage(resp, id, chat_id, 'isChat', reddit)
        }
      })
    }, 1000)
  }
  destroy() {
    if (this.reddit) {
      this.reddit = null
    }
  }
}
