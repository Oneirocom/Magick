import { app } from '@magickml/server-core'
// App imports.
import * as IMAP from './IMAP'
import * as SMTP from './SMTP'

export class GmailConnector {
  spellRunner
  data
  agent
  gmail_stream_rules = ''
  localUser: any
  worldManager: any
  mailboxes: IMAP.IMailbox[] | undefined
  imapWorker: IMAP.Worker | undefined
  loop: any

  constructor({ spellRunner, agent, worldManager }) {
    this.agent = agent
    this.agent.gmail = this
    this.spellRunner = spellRunner
    const data = this.agent.data.data
    this.data = data
    this.worldManager = worldManager // we can track entities in different conversations here later

    if (!data.gmail_enabled) {
      console.warn('Gmail is not enabled, skipping')
      return
    }

    ;(async () => {
      const serverInfo = this.makeServerInfo(
        this.data.gmail_address,
        this.data.gmail_password
      )

      this.imapWorker = new IMAP.Worker(serverInfo)

      this.mailboxes = (await this.getMailboxes()) as IMAP.IMailbox[]

      console.log('mailboxes', this.mailboxes)

      // if mailboxes is not an array, return
      if (!Array.isArray(this.mailboxes)) {
        return console.error('no mailboxes')
      }

      this.loop = setInterval(() => {
        this.handler()
      }, 1000)
    })()
  }

  async handler() {
    this.mailboxes?.map(async mailbox => {
      console.log('mailbox', mailbox)
      const messages = await this.getMessagesFromMailbox(mailbox)
      // if messages is not an array, return
      if (!Array.isArray(messages)) {
        return console.log('no messages')
      }
      messages.map(async message => {
        console.log('message', message)
        const messageBody = await this.getMessageBody({
          id: message.id,
          mailbox: mailbox,
          address: this.data.gmail_address,
          password: this.data.gmail_password,
        })

        const resp = await this.spellRunner.runComponent({
          inputs: {
            [`Input - Gmail`]: {
              connector: 'Gmail',
              content: messageBody,
              sender: message.from,
              observer: this.data.gmail_address,
              client: 'gmail',
              channel: mailbox.name,
              agentId: this.agent.id,
              entities: [message.from, this.data.gmail_address], // TODO: Need to get all CC and senders
              channelType: 'email', // TODO: Determine if sent to us or we are CC'd
              rawData: JSON.stringify({ message, mailbox, messageBody }),
            },
          },
          agent: this.agent,
          secrets: this.agent.secrets,
          publicVariables: this.agent.publicVariables,
          app,
          runSubspell: true,
        })
        console.log('resp is', resp)
      })
    })
  }

  async handleResponse(resp, event) {
    const rawData = JSON.parse(event.rawData)

    await this.sendMessage({
      to: [rawData.message.from],
      from: this.data.gmail_address,
      subject: 'Re: ' + rawData.message.subject,
      text: resp,
      address: this.data.gmail_address,
      password: this.data.gmail_password,
    })
  }

  destroy() {
    this.imapWorker?.client?.close()
    clearInterval(this.loop)
  }

  // Example serverInfo object
  makeServerInfo(address, password) {
    return {
      smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: address,
          pass: password,
        },
      },
      imap: {
        host: 'imap.gmail.com',
        port: 993,
        auth: {
          user: address,
          pass: password,
        },
      },
    }
  }

  // Get list of mailboxes.
  async getMailboxes() {
    if (!this.imapWorker) {
      return console.log('no imapWorker')
    }
    try {
      const mailboxes: IMAP.IMailbox[] = await this.imapWorker.listMailboxes()
      console.log('mailboxes', mailboxes)
      return mailboxes
    } catch (inError) {
      return 'error, could not retrieve mailboxes' + inError
    }
  }

  // Get list of messages in a mailbox (does NOT include bodies).
  async getMessagesFromMailbox(mailbox: IMAP.IMailbox) {
    if (!this.imapWorker) {
      return console.log('no imapWorker')
    }
    try {
      const messages: IMAP.IMessage[] = await this.imapWorker.listMessages({
        mailbox,
      })
      return messages
    } catch (inError) {
      return 'error'
    }
  }

  // Get a message's plain text body.
  async getMessageBody({
    id,
    mailbox,
    address,
    password,
  }: {
    id: string
    mailbox: IMAP.IMailbox
    address: string
    password: string
  }) {
    const serverInfo = this.makeServerInfo(address, password)
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo)
      const messageBody: string | boolean = await imapWorker.getMessageBody({
        mailbox: mailbox,
        id: parseInt(id),
      })
      return messageBody
    } catch (inError) {
      return 'error'
    }
  }

  // Delete a message.
  async deleteMessage({
    mailbox,
    id,
    address,
    password,
  }: {
    mailbox: IMAP.IMailbox
    id: string
    address: string
    password: string
  }) {
    const serverInfo = this.makeServerInfo(address, password)
    try {
      const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo)
      await imapWorker.deleteMessage({
        mailbox: mailbox,
        id: parseInt(id, 10),
      })
      return true
    } catch (inError) {
      return 'error'
    }
  }

  // Send a message.
  async sendMessage({
    to,
    from,
    subject,
    text,
    address,
    password,
  }: {
    to: string[]
    from: string
    subject: string
    text: string
    address: string
    password: string
  }) {
    console.log('sending message')
    const serverInfo = this.makeServerInfo(address, password)
    try {
      const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo)
      await smtpWorker.sendMessage({
        to,
        from,
        subject,
        text,
      })
      return true
    } catch (inError) {
      return 'error'
    }
  }
}
