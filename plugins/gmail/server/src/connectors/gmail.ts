import { app } from '@magickml/server-core'
// App imports.
import * as IMAP from './IMAP'
import * as SMTP from './SMTP'

// Example serverInfo object
export const makeServerInfo = (address, password) => {
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
export const getMailboxes = async (address, password) => {
  const serverInfo = makeServerInfo(address, password)
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo)
    const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes()
    return mailboxes
  } catch (inError) {
    return 'error, could not retrieve mailboxes'
  }
}

// Get list of messages in a mailbox (does NOT include bodies).
export const getMessagesFromMailbox = async ({
  mailbox,
  address,
  password,
}: {
  mailbox: IMAP.IMailbox
  address: string
  password: string
}) => {
  const serverInfo = makeServerInfo(address, password)
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo)
    const messages: IMAP.IMessage[] = await imapWorker.listMessages({
      mailbox,
    })
    return messages
  } catch (inError) {
    return 'error'
  }
}

// Get a message's plain text body.
export const getMessageBody = async ({
  id,
  mailbox,
  address,
  password,
}: {
  id: string
  mailbox: IMAP.IMailbox
  address: string
  password: string
}) => {
  const serverInfo = makeServerInfo(address, password)
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
export const deleteMessage = async ({
  mailbox,
  id,
  address,
  password,
}: {
  mailbox: IMAP.IMailbox
  id: string
  address: string
  password: string
}) => {
  const serverInfo = makeServerInfo(address, password)
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
export const sendMessage = async ({
  to,
  from,
  subject,
  text,
  address,
  password,
}: {
  to: string[],
  from: string,
  subject: string,
  text: string,
  address: string
  password: string
}) => {
  console.log('sending message')
  const serverInfo = makeServerInfo(address, password)
  try {
    const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo)
    await smtpWorker.sendMessage({
      to,
      from,
      subject,
      text
    })
    return true
  } catch (inError) {
    return 'error'
  }
}

export class GmailConnector {
  spellRunner
  data
  agent
  gmail_stream_rules = ''
  localUser: any
  worldManager: any

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
    console.log('Gmail enabled, initializing...')

    this.loop = setInterval(() => {
      this.handler()
    }, 1000)
  }

  async handler() {
    const mailboxes = await getMailboxes(
      this.data.gmail_address,
      this.data.gmail_password
    )

    // if mailboxes is not an array, return
    if (!Array.isArray(mailboxes)) {
      return
    }

    mailboxes.map(async mailbox => {
      const messages = await getMessagesFromMailbox({
        mailbox,
        address: this.data.gmail_address,
        password: this.data.gmail_password,
      })
      // if messages is not an array, return
      if (!Array.isArray(messages)) {
        return
      }
      messages.map(async message => {
        const messageBody = await getMessageBody({
          id: message.id,
          mailbox: mailbox,
          address: this.data.gmail_address,
          password: this.data.gmail_password,
        })

        const resp = await this.spellRunner.runComponent({
          inputs: {
            [`Input - Gmail`]: {
              content: messageBody,
              sender: message.from,
              observer: this.data.gmail_address,
              client: 'gmail',
              channel: mailbox.name,
              agentId: this.agent.id,
              entities: [message.from, this.data.gmail_address], // TODO: Need to get all CC and senders
              channelType: 'email', // TODO: Determine if sent to us or we are CC'd
              rawData: JSON.stringify({message, mailbox, messageBody}),
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

    await sendMessage({
      to: [rawData.message.from],
      from: this.data.gmail_address,
      subject: 'Re: ' + rawData.message.subject,
      text: resp,
      address: this.data.gmail_address,
      password: this.data.gmail_password,
    })
  }

  destroy() {
    clearInterval(this.loop)
  }
}
