// App imports.
import * as IMAP from './IMAP'
import * as SMTP from './SMTP'

interface IServerInfo {
  smtp : {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    }
  },
  imap : {
    host: string,
    port: number,
    auth: {
      user: string,
      pass: string
    }
  }
}

// Get list of mailboxes.
export const getMailboxes = async (serverInfo: IServerInfo) => {
  try {
    const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo)
    const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes()
    return mailboxes
  } catch (inError) {
    return 'error, could not retrieve mailboxes'
  }
}

// Get list of messages in a mailbox (does NOT include bodies).
export const getMessagesFromMailbox = async ({ mailbox, serverInfo }: {
  mailbox: string
  serverInfo: IServerInfo
}) => {
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
export const getMessageBody = async ({ id, mailbox, serverInfo }: {
  id: string
  mailbox: string
  serverInfo: IServerInfo
}) => {
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
export const deleteMessage = async ({ mailbox, id, serverInfo }: {
  mailbox: string
  id: string
  serverInfo: IServerInfo
}) => {
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
export const sendMessage = async ({ body, serverInfo }: {
  body: string
  serverInfo: IServerInfo
}) => {
  try {
    const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo)
    await smtpWorker.sendMessage(body)
    return true
  } catch (inError) {
    return 'error'
  }
}
