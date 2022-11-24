/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable require-await */
/* eslint-disable camelcase */
/* eslint-disable no-invalid-this */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { log } from 'console'
import request from 'request'

export class messenger_client {
  static instance: messenger_client
  spellHandler
  settings
  entity
  haveCustomCommands
  custom_commands

  handleMessage = async (senderPsid, receivedMessage) => {
    const text = receivedMessage.text
    console.log('receivedMessage: ' + text + ' from: ' + senderPsid)

    if (receivedMessage.text) {
      if (this.haveCustomCommands) {
        for (let i = 0; i < this.custom_commands[i].length; i++) {
          if (text.startsWith(this.custom_commands[i].command_name)) {
            const _content = text.replace(
              this.custom_commands[i].command_name,
              ''
            )

            const response = await this.custom_commands[i].spell_handler(
              _content,
              senderPsid,
              'MessengerBot',
              'messenger',
              senderPsid,
              null,
              []
            )

            this.callSendAPI(senderPsid, { text: response }, response)
            return
          }
        }
      }

      const resp = await this.spellHandler(
        text,
        senderPsid,
        'MessengerBot',
        'messenger',
        senderPsid,
        null,
        [],
        'msg'
      )
      this.callSendAPI(senderPsid, { text: resp }, resp)
    }
  }

  async callSendAPI(senderPsid, response, text) {
    // The page access token we have generated in your app settings
    const PAGE_ACCESS_TOKEN = this.settings.messenger_page_access_token

    // Construct the message body
    const requestBody = {
      recipient: {
        id: senderPsid,
      },
      message: response,
    }

    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: 'https://graph.facebook.com/v14.0/me/messages',
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: requestBody,
      },
      (err, _res, _body) => {
        if (!err) {
          console.log('Message sent!')
        } else {
          console.error('Unable to send message:' + err)
        }
      }
    )
  }

  createMessengerClient = async (
    app,
    router,
    spellHandler,
    settings,
    entity
  ) => {
    messenger_client.instance = this
    this.spellHandler = spellHandler
    this.settings = settings
    this.entity = entity
    this.haveCustomCommands = settings.haveCustomCommands
    this.custom_commands = settings.custom_commands

    const { messenger_page_access_token, messenger_verify_token } =
      this.settings

    if (!messenger_page_access_token || !messenger_verify_token) {
      return console.warn('No API tokens for Messenger bot, skipping')
    }

    app.get('/webhook', async function (req, res) {
      const VERIFY_TOKEN = messenger_verify_token

      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']

      if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          log('WEBHOOK_VERIFIED')
          res.status(200).send(challenge)
        } else {
          log('WEBHOOK_FORBIDDEN')
          res.sendStatus(403)
        }
      }
    })
    app.post('/webhook', async function (req, res) {
      const body = req.body

      if (body.object === 'page') {
        await body.entry.forEach(async function (entry) {
          const webhookEvent = entry.messaging[0]
          const senderPsid = webhookEvent.sender.id

          if (webhookEvent.message) {
            await messenger_client.instance.handleMessage(
              senderPsid,
              webhookEvent.message
            )
          }
        })

        res.status(200).send('EVENT_RECEIVED')
      } else {
        res.sendStatus(404)
      }
    })
    log('facebook client created')
  }
}
