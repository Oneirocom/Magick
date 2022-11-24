/* eslint-disable no-console */
/* eslint-disable no-invalid-this */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment

import express from 'express'
import { MessagingRequest } from 'src/types'
import Twilio from 'twilio'

import { getRandomEmptyResponse, getSetting } from './utils'

export class twilio_client {
  async message(req: MessagingRequest, res: any) {
    if (this.haveCustomCommands) {
      for (let i = 0; i < this.custom_commands[i].length; i++) {
        if (req.body.Body.startsWith(this.custom_commands[i].command_name)) {
          const _content = req.body.Body.replace(
            this.custom_commands[i].command_name,
            ''
          )

          const response = await this.custom_commands[i].spell_handler(
            _content,
            req.body.From,
            this.settings.twilio_bot_name ?? 'Agent',
            'twilio',
            req.body.From,
            this.settings.entity,
            []
          )

          await this.handleTwilioMsg(req.body.From, response)
          return
        }
      }
    }

    const resp = this.spellHandler(
      req.body.Body,
      req.body.From,
      this.settings.twilio_bot_name ?? 'Agent',
      'twilio',
      req.body.From,
      this.settings.entity,
      [],
      'msg'
    )
    await this.handleTwilioMsg(req.body.From, resp)
  }

  async handleTwilioMsg(chat_id: string, response: string) {
    console.log('response: ' + response)
    if (
      response !== undefined &&
      response.length <= 2000 &&
      response.length > 0
    ) {
      let text = response
      while (
        text === undefined ||
        text === '' ||
        text.replace(/\s/g, '').length === 0
      )
        text = getRandomEmptyResponse(this.settings.twilio_empty_responses)
      this.sendMessage(chat_id, text)
    } else if (response.length > 160) {
      const lines = []
      let line = ''
      for (let i = 0; i < response.length; i++) {
        line += response
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
              text = getRandomEmptyResponse(
                this.settings.twilio_empty_responses
              )
            this.sendMessage(chat_id, text)
          }
        }
      }
    } else {
      let emptyResponse = getRandomEmptyResponse(
        this.settings.twilio_empty_responses
      )
      while (
        emptyResponse === undefined ||
        emptyResponse === '' ||
        emptyResponse.replace(/\s/g, '').length === 0
      )
        emptyResponse = getRandomEmptyResponse(
          this.settings.twilio_empty_responses
        )
      this.sendMessage(chat_id, emptyResponse)
    }
  }

  client: any
  settings: any
  spellHandler: any
  haveCustomCommands: any
  custom_commands: any

  createTwilioClient = async (
    app: any,
    router: express.Router,
    settings: any,
    spellHandler: any
  ) => {
    this.settings = settings
    this.spellHandler = spellHandler
    this.haveCustomCommands = settings.haveCustomCommands
    this.custom_commands = settings.custom_commands

    const accountSid = settings.twlio_account_sid
    const authToken = settings.twlio_auth_token
    const twilioNumber = settings.twlio_phone_number

    if (!accountSid || !authToken || !twilioNumber)
      return console.warn('No API token for Twilio bot, skipping')
    console.log(
      'twilio client created, sid: ' + accountSid + ' auth token: ' + authToken
    )

    this.client = Twilio(accountSid, authToken)

    app.use(
      '/sms',
      router.post('/', async (req: MessagingRequest, res: any) => {
        await this.message(req, res)
      })
    )
  }

  sendMessage(toNumber: string, body: string) {
    console.log('sending sms: ' + body)
    this.client.messages
      .create({
        from: this.settings.twlio_phone_number,
        to: toNumber,
        body: body,
      })
      .then((message: any) => console.log('sent message: ' + message.sid))
      .catch(console.error)
    console.log('send message to: ' + toNumber + ' body: ' + body)
  }
}
