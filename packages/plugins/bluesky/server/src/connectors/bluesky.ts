import { BskyAgent, AppBskyNotificationGetUnreadCount } from '@atproto/api'
import { app } from 'server/core'

export class BlueskyConnector {
  declare bskyAgent: BskyAgent
  spellRunner
  data
  agent
  bluesky_stream_rules = ''
  localUser: any

  loop: any

  constructor({ spellRunner, agent }) {
    this.agent = agent
    this.agent.bluesky = this
    this.spellRunner = spellRunner
    const data = this.agent.data.data
    this.data = data

    if (!data.bluesky_enabled) {
      console.warn('Bluesky is not enabled, skipping')
      return
    }
    console.log('Bluesky enabled, initializing...')

    this.initialize({ data })
  }

  async initialize({ data }) {
    this.bskyAgent = new BskyAgent({
      service: 'https://bsky.social',
    })
    await this.bskyAgent.login({
      identifier: data.bluesky_identifier,
      password: data.bluesky_password,
    })
    console.log('logged in to bluesky with', data.bluesky_identifier)
    this.loop = setInterval(() => {
      this.handler()
    }, 1000)
  }

  async handler() {
    const count: AppBskyNotificationGetUnreadCount.Response =
      await this.bskyAgent.countUnreadNotifications()
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
      const post_uri = type === 'reply' ? record.reply.parent.uri : notif.uri
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
      const entities = [author, this.data.bluesky_identifier]
      console.log('sending bsky input to spellrunner', entities)
      const resp = await app.get('agentCommander').runSpell({
        inputs: {
          [`Input - Bluesky (${type === 'reply' ? 'Reply' : 'Mention'})`]: {
            connector: `Bluesky (${type === 'reply' ? 'Reply' : 'Mention'})`,
            content: text,
            sender: author,
            observer: this.data.bluesky_identifier,
            client: 'bluesky',
            channel: (post_thread.data.thread?.post as any)?.uri,
            agentId: this.agent.id,
            entities,
            channelType: type,
            rawData: JSON.stringify(notif),
          },
        },
        agent: this.agent,
        agentId: this.agent.id,
        spellId: this.agent.rootSpellId,
        secrets: this.agent.secrets,
        publicVariables: this.agent.publicVariables,
        runSubspell: true,
      })
      console.log('resp is', resp)
    })
  }

  async handleResponse(resp, event) {
    const notif = JSON.parse(event.rawData)
    console.log('handling bluesky message', notif)
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
