import { BskyAgent } from '@atproto/api'
export class BlueskyConnector {
  bskyAgent: BskyAgent
  spellRunner
  data
  agent
  bluesky_stream_rules = ''
  localUser: any
  worldManager: any

  loop: any

  constructor({ spellRunner, agent, worldManager }) {
    this.agent = agent
    this.agent.bluesky = this
    this.spellRunner = spellRunner
    const data = this.agent.data.data
    this.data = data
    this.worldManager = worldManager // we can track entities in different conversations here later

    if (!data.bluesky_enabled) {
      console.warn('Bluesky is not enabled, skipping')
      return
    }
    console.log('Bluesky enabled, initializing...')

    this.initialize({ data })
  }

  async initialize({ data }) {
    this.bskyAgent = new BskyAgent({
      service: 'https://bsky.social'
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
    const count = await this.bskyAgent.countUnreadNotifications()
    if( count > 0 ){
      console.log(`Found ${count} new mentions.`)
    }
    // Get a list of bsky notifs
    const response_notifs = await this.bskyAgent.listNotifications()
    const notifs = response_notifs.data.notifications

    // Mark all these notifs as read

    // Count the number of notifications which are unread
    // and which are also mentions
    const unread_mentions = notifs.filter(notif => {
      return (notif.reason === 'mention' || notif.reason === 'reply') && notif.isRead === false
    })
    if(notifs.length > 0){
      // console.log('notifs', notifs)
    }
    if(unread_mentions.length > 0){
    console.log(`Found ${unread_mentions.length} new mentions.`)
    }
    this.bskyAgent.updateSeenNotifications()

    unread_mentions.map(async notif => {
      console.log(`Responding to ${notif.uri}`)

      if ('reply' in notif.record) {
        const post_uri = notif.record.reply.parent.uri
        const post_thread = await this.bskyAgent.getPostThread({
          uri: post_uri,
          depth: 1,
        })
        const root = notif.record.reply.root
        const post_text = post_thread.data.thread.post.record.text
        console.log('root is', root);
        console.log('handle reply, post_text is', post_text)
      } else {
        const post_text = notif.record.text
        console.log('handling non-reply, post_text is', post_text)
      }
    })
  }

  async postMessage(content) {
    await this.bskyAgent.post({
      text: content,
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
