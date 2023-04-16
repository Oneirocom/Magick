import { app } from '@magickml/server-core'
// App imports.
import * as IMAP from './IMAP'
import * as SMTP from './SMTP'

// Example serverInfo object
export const makeServerInfo = (address, password) => {
  return {
    smtp : {
      host : "smtp.gmail.com",
      port : 465,
      auth : {
        user : address,
        pass : password
      }
    },
    imap : {
      host : "imap.gmail.com",
      port : 993,
      auth : {
        user : address,
        pass : password
      }
    }
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
export const getMessagesFromMailbox = async ({ mailbox, address, password }: {
  mailbox: string
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
export const getMessageBody = async ({ id, mailbox, address, password }: {
  id: string
  mailbox: string
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
export const deleteMessage = async ({ mailbox, id, address, password }: {
  mailbox: string
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
export const sendMessage = async ({ body, address, password }: {
  body: string
  address: string
  password: string
}) => {
  const serverInfo = makeServerInfo(address, password)
  try {
    const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo)
    await smtpWorker.sendMessage(body)
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
    const mailboxes = await getMailboxes(this.data.gmail_address, this.data.gmail_password)
    const messages = mailboxes.map(async mailbox => {
      const _messages = await getMessagesFromMailbox({
        mailbox,
        address: this.data.gmail_address,
        password: this.data.gmail_password,
      })
      return _messages
    })

    messages.map(async message => {

      const resp = await this.spellRunner.runComponent({
        inputs: {
          [`Input - Gmail (${type === 'reply' ? 'Reply' : 'Mention'})`]: {
            content: text,
            sender: author,
            observer: this.data.gmail_address,
            client: 'gmail',
            channel: (post_thread.data.thread?.post as any)?.uri,
            agentId: this.agent.id,
            entities,
            channelType: type,
            rawData: JSON.stringify(notif),
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
  }

  async handleResponse(resp, event) {
    const notif = JSON.parse(event.rawData)
    console.log('handling gmail message', notif)
    const root = notif.record.reply?.root || notif
    const content = resp
    await this.sendReply(content, root, notif)
  }

  destroy() {
    clearInterval(this.loop)
  }
}
