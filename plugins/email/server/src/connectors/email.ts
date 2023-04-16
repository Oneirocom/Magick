import { BskyAgent, AppBskyNotificationGetUnreadCount } from '@atproto/api'
import { app } from '@magickml/server-core'
export class EmailConnector {
  bskyAgent: BskyAgent
  spellRunner
  data
  agent
  email_stream_rules = ''
  localUser: any
  worldManager: any

  loop: any

  constructor({ spellRunner, agent, worldManager }) {
    this.agent = agent
    this.agent.email = this
    this.spellRunner = spellRunner
    const data = this.agent.data.data
    this.data = data
    this.worldManager = worldManager // we can track entities in different conversations here later

    if (!data.email_enabled) {
      console.warn('Email is not enabled, skipping')
      return
    }
    console.log('Email enabled, initializing...')

    this.initialize({ data })
  }

  async initialize({ data }) {
    this.bskyAgent = new BskyAgent({
      service: 'https://bsky.social',
    })
    await this.bskyAgent.login({
      identifier: data.email_identifier,
      password: data.email_password,
    })
    console.log('logged in to email with', data.email_identifier)
    this.loop = setInterval(() => {
      this.handler()
    }, 1000)
  }

  async handler() {
    const count: AppBskyNotificationGetUnreadCount.Response = await this.bskyAgent.countUnreadNotifications()
    if (count.data.count > 0) {
      console.log(`Found ${count} new mentions.`)
    }
    // Get a list of bsky notifs
    const response_notifs = await this.bskyAgent.listNotifications()
    const notifs = response_notifs.data.notifications

    // Mark all these notifs as read

    // Count the number of notifications which are unread
    // and which are also mentions
    const unread_mentions = notifs.filter(notif => {
      return (
        (notif.reason === 'mention' || notif.reason === 'reply') &&
        notif.isRead === false
      )
    })
    if (notifs.length > 0) {
      // console.log('notifs', notifs)
    }
    if (unread_mentions.length > 0) {
      console.log(`Found ${unread_mentions.length} new mentions.`)
    }
    this.bskyAgent.updateSeenNotifications()

    unread_mentions.map(async notif => {
      console.log(`Responding to ${notif.uri}`)
      console.log('notif', notif)

      const type = 'reply' in notif.record ? 'reply' : 'mention'
      const record = notif.record as any
      const text = record.text
      const post_uri =
        type === 'reply' ? record.reply.parent.uri : notif.uri
      const post_thread = await this.bskyAgent.getPostThread({
        uri: post_uri,
        depth: 1,
      })
      const root = type === 'reply' ? record.reply?.root : notif.uri
      const post_text = (post_thread.data?.thread?.post as any)?.record.text
      console.log('reply root is', root)
      console.log('handle reply, post_text is', post_text)

      // get the author of the post
      const author = notif.author.handle

      console.log('author is', author)
      const entities = [author, this.data.email_identifier]
      console.log('sending bsky input to spellrunner', entities)
      const resp = await this.spellRunner.runComponent({
        inputs: {
          [`Input - Email (${type === 'reply' ? 'Reply' : 'Mention'})`]: {
            content: text,
            sender: author,
            observer: this.data.email_identifier,
            client: 'email',
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
    console.log('handling email message', notif)
    const root = notif.record.reply?.root || notif
    const content = resp
    await this.sendReply(content, root, notif)
  }

  async handlePost(resp) {
    await this.bskyAgent.post({
      text: resp,
    })
  }

  async sendReply(content, root, notif) {
    await this.bskyAgent.post({
      text: content,
      reply: {
        parent: {
          uri: notif.uri,
          cid: notif.cid,
        },
        root: {
          uri: root.uri,
          cid: root.cid,
        },
      },
    })
  }
  destroy() {
    clearInterval(this.loop)
  }
}
