import { TwitterApi, ETwitterStreamEvent } from 'twitter-api-v2'

export class TwitterConnector {
  async handleMessage(response, chat_id, args) {
    if (args === 'DM') {
      await this.twitterv1.v1.sendDm({
        recipient_id: chat_id,
        text: response,
      })
    } else if (args === 'feed') {
      await this.twitterv1.v1.reply(response, chat_id)
    }
  }

  regexMatch(regexes: string[], input: string): boolean {
    if (!input || input?.length <= 0) {
      return false
    }

    for (let i = 0; i < regexes.length; i++) {
      if (input.match(regexes[i])) {
        return true
      }
    }

    return false
  }

  twitterv1: TwitterApi
  twitterv2: TwitterApi
  twitterv2_replies: TwitterApi
  spellRunner
  spellHandlerAuto
  settings
  agent
  twitter_enable_twits = false
  twitter_tweet_rules = ''
  localUser: any

  constructor({ spellRunner, spellHandlerAuto, settings, agent }) {
    agent.twitter = this
    this.spellRunner = spellRunner
    this.spellHandlerAuto = spellHandlerAuto
    this.settings = settings
    this.agent = agent
    this.twitter_enable_twits =
      settings.twitter_enable_twits === true ||
      settings.twitter_enable_twits === 'true'

    this.twitter_tweet_rules = settings.twitter_tweet_rules
    if (!this.twitter_tweet_rules || this.twitter_tweet_rules?.length === 0) {
      this.twitter_enable_twits = false
    }

    const bearerToken = getSetting(
      settings.twitter_bearer_token,
      'Bearer Token (Twitter API V2)'
    )
    const twitterUser = getSetting(settings.twitter_userid, 'User ID (@)')
    const twitterAppToken = getSetting(settings.twitter_app_token, 'App Token')
    const twitterAppTokenSecret = getSetting(
      settings.twitter_app_token_secret,
      'App Token Secret'
    )
    const twitterAccessToken = getSetting(
      settings.twitter_access_token,
      'Access Token'
    )
    const twitterAccessTokenSecret = getSetting(
      settings.twitter_access_token_secret,
      'Access Token Secret'
    )

    if (
      !bearerToken ||
      !twitterAppToken ||
      !twitterAppTokenSecret ||
      !twitterAccessToken ||
      !twitterAccessTokenSecret ||
      !twitterUser
    ) {
      console.log(
        `Twitter is not configured properly for agent ${this.agent.id} - skipping`
      )
      return
    }

    this.twitterv1 = new TwitterApi({
      appKey: twitterAppToken,
      appSecret: twitterAppTokenSecret,
      accessToken: twitterAccessToken,
      accessSecret: twitterAccessTokenSecret,
    })

    this.twitterv2 = new TwitterApi(bearerToken)
    this.twitterv2_replies = TwitterApi(bearerToken)
    this.initialize({ settings })
  }

  async initialize({ settings }) {
    const twitterUser = getSetting(settings.twitter_userid, 'User ID (@)')

    this.localUser = await this.twitterv2.v2.userByUsername(twitterUser)

    const stream = await this.twitterv2_replies.v2.searchStream({
      'tweet.fields': ['referenced_tweets', 'author_id'],
      expansions: ['referenced_tweets.id'],
    })

    stream.autoReconnect = true
    stream.on(ETwitterStreamEvent.Data, async twit => {
      if (
        twit.data.referenced_tweets &&
        twit.includes &&
        twit.data.referenced_tweets !== undefined &&
        twit.includes !== undefined &&
        twit.includes.tweets.length > 0 &&
        twit.includes.tweets[0].author_id == this.localUser.data.id &&
        twit.data.author_id !== this.localUser.data.id &&
        twit.data.text.startsWith('@' + this.localUser.data.username)
      ) {
        const author = await this.twitterv2.v2.user(twit.data.author_id)
        const entities = [author.data.name, twitterUser]

        const input = twit.data.text.replace(
          '@' + this.localUser.data.username,
          ''
        )

        if (author === twitterUser) {
          return console.warn(
            'Bot was going to reply to self, ignoring tweet:',
            input
          )
        }

        const resp = await this.spellRunner.runComponent({
          inputs: {
            'Input - Twitter': {
              content: input,
              sender: author.data.name,
              observer: twitterUser,
              client: 'twitter',
              channel: twit.data.id,
              agentId: this.agent.id,
              entities,
              channelType: 'feed',
            },
          },
          agent: this.agent,
          secrets: this.agent.secrets,
          publicVariables: this.agent.publicVariables,
          runSubspell: true,
        })
      }
    })

    try {
      const client = this.twitterv2
      const rules = await client.v2.streamRules()
      if (rules.data?.length) {
        await client.v2.updateStreamRules({
          delete: { ids: rules.data.map(rule => rule.id) },
        })
      }
      const tweetRules = this.twitter_tweet_rules.split(',') as any[]
      const _rules = [] as any[]
      const regex = [] as any[]
      for (const x in tweetRules) {
        _rules.push({ value: tweetRules[x] })
        regex.push(tweetRules[x])
      }
      await client.v2.updateStreamRules({
        add: _rules,
      })
      const stream = await client.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id'],
      })
      stream.autoReconnect = true
      stream.on(ETwitterStreamEvent.Data, async twit => {
        const isARt =
          twit.data.referenced_tweets?.some(
            twit => twit.type === 'retweeted'
          ) ?? false
        const isReply =
          twit.data.referenced_tweets &&
          twit.includes &&
          twit.data.referenced_tweets !== undefined &&
          twit.includes !== undefined &&
          twit.includes.tweets.length > 0 &&
          twit.includes.tweets[0].author_id === this.localUser.data.id

        if (
          isARt ||
          isReply ||
          (this.localUser !== undefined &&
            twit.data.author_id == this.localUser.data.id)
        ) {
          return
        } else {
          if (!this.regexMatch(regex, twit.data.text)) {
            return
          } else {
            const author = await this.twitterv2.v2.user(twit.data.author_id)
            const entities = [author.data.name, twitterUser]
            const resp = await this.spellRunner.runComponent({
              inputs: {
                'Input - Twitter': {
                  content: twit.data.text,
                  sender: author.data.name,
                  observer: twitterUser,
                  client: 'twitter',
                  channel: twit.data.id,
                  agentId: this.agent.id,
                  entities,
                  channelType: 'feed',
                },
              },
              agent: this.agent,
              secrets: this.agent.secrets,
              publicVariables: this.agent.publicVariables,
              runSubspell: true,
            })
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
}

function getSetting(setting, settingName) {
  if (!setting) {
    console.warn(`Could not get Twitter setting for '${settingName}'`)
    return null
  }
  return setting
}
