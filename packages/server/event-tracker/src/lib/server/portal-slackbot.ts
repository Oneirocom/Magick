import { type UserJSON } from '@clerk/nextjs/server'
import { WebhookSender } from './webhook-sender'

export type SlackMessage = {
  text: string
  blocks: any[]
}
export type PortalBotPayload = {
  event: string
  content: string | undefined
  slackMessage?: SlackMessage
}

export class PortalBot {
  private useLogs: boolean
  private botEnabled: boolean
  private botUrl: string = process.env.PORTAL_BOT_URL || ''
  private event: WebhookSender = new WebhookSender(this.botUrl)

  constructor(useLogs: boolean, botEnabled: boolean) {
    this.useLogs = useLogs
    this.botEnabled = botEnabled
  }

  public async log(p: PortalBotPayload) {
    if (this.useLogs) {
      console.log(
        `\x1b[35mCLERK: ${p.event}: ${
          p.content || 'Content was undefined.'
        }\x1b[0m`
      )
    }
    if (p.slackMessage && this.botEnabled) {
      await this.slackLog(p.slackMessage)
    }
  }

  public async slackLog(m: SlackMessage) {
    await this.event.send(m)
  }

  public makeUserMessage(user: UserJSON) {
    return {
      text: `${user.username} User Signup`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${user.username} Profile Information*`,
          },
        },
        {
          type: 'section',
          block_id: 'section567',
          text: {
            type: 'mrkdwn',
            text: `*ID*: ${user.id}\n*Username*: ${user.username}\n*Email*: ${
              user.email_addresses[0].email_address || 'No email'
            }\n*Created At*: ${
              user.created_at
            }\n*Sent At*: ${new Date().toISOString()}`,
          },
          accessory: {
            type: 'image',
            image_url: user.image_url,
            alt_text: 'User avatar',
          },
        },
      ],
    }
  }
}
