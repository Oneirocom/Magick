import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2'
export class TwitterConnector {
  twitterv1: TwitterApi | undefined
  twitterv2: TwitterApi | undefined
  twitterv2_replies: TwitterApi | undefined
  spellRunner
  data
  agent
  twitter_stream_rules = ''
  localUser: any

  constructor({ spellRunner, agent }) {
    agent.twitter = this
    this.spellRunner = spellRunner
    const data = agent.data.data
    this.data = data
    this.agent = agent
    if (!data.twitter_enabled) {
      console.warn('Twitter is not enabled, skipping')
      return
    }
    console.log('Twitter enabled, initializing...')
    this.twitter_stream_rules = data.twitter_stream_rules

    const bearerToken = getSetting(
      data.twitter_bearer_token,
      'Bearer Token (Twitter API V2)'
    )
    const twitterUser = getSetting(data.twitter_userid, 'User ID (@)')
    const twitterApiKey = getSetting(data.twitter_api_key, 'API Key')
    const twitterApiKeySecret = getSetting(
      data.twitter_api_key_secret,
      'API Key Secret'
    )
    const twitterAccessToken = getSetting(
      data.twitter_access_token,
      'Access Token'
    )
    const twitterAccessTokenSecret = getSetting(
      data.twitter_access_token_secret,
      'Access Token Secret'
    )

    console.log('twitterUser', twitterUser)
    console.log('twitterApiKey', twitterApiKey)
    console.log('twitterApiKeySecret', twitterApiKeySecret)
    console.log('twitterAccessToken', twitterAccessToken)
    console.log('twitterAccessTokenSecret', twitterAccessTokenSecret)
    console.log('bearerToken', bearerToken)
    console.log('streamRules', data.twitter_stream_rules)

    //

    const streamRules = getSetting(data.twitter_stream_rules, 'Stream Rules')

    if (
      !bearerToken ||
      !twitterApiKey ||
      !twitterApiKeySecret ||
      !twitterAccessToken ||
      !twitterAccessTokenSecret ||
      !twitterUser ||
      !streamRules
    ) {
      console.log(
        `Twitter is not configured properly for agent ${this.agent.id} - skipping`
      )
      return
    }

    this.twitterv1 = new TwitterApi({
      appKey: twitterApiKey,
      appSecret: twitterApiKeySecret,
      accessToken: twitterAccessToken,
      accessSecret: twitterAccessTokenSecret,
    })

    this.twitterv2 = new TwitterApi(bearerToken)
    console.log('Initializing Twitter...')
    this.initialize({ data })
  }

  async initialize({ data }) {
    if (!this.twitterv2) {
      return console.log('Twitter not initialized properly')
    }

    const twitterUser = getSetting(data.twitter_userid, 'User ID (@)')

    this.localUser = await this.twitterv2.v2.userByUsername(twitterUser)

    console.log('twitterUser', data.twitter_userid)
    // const stream = await this.twitterv2_replies.v2.searchStream({
    //   'tweet.fields': ['referenced_tweets', 'author_id'],
    //   expansions: ['referenced_tweets.id'],
    // })

    // stream.autoReconnect = true
    // stream.on(ETwitterStreamEvent.Data, async ev => {
    //   console.log('*********** STREAM EVENT')
    //   const tw = ev.includes as any
    //   if (
    //     ev.includes &&
    //     tw.tweets[0].author_id == this.localUser.data.id &&
    //     tw.tweets.length > 0 &&
    //     ev.data.referenced_tweets &&
    //     ev.data.referenced_tweets !== undefined &&
    //     ev.data.author_id !== this.localUser.data.id &&
    //     ev.data.text.startsWith('@' + this.localUser.data.username)
    //   ) {
    //     const data = ev.data as any
    //     if (!this.twitterv2) {
    //       return console.log('Twitter not initialized properly')
    //     }
    //     const author = await this.twitterv2.v2.user(data.author_id)
    //     const entities = [author.data.name, twitterUser]

    //     const input = ev.data.text.replace(
    //       '@' + this.localUser.data.username,
    //       ''
    //     )

    //     if (author === twitterUser) {
    //       return console.warn(
    //         'Bot was going to reply to self, ignoring tweet:',
    //         input
    //       )
    //     }

    //     const resp = await this.spellRunner.runComponent({
    //       inputs: {
    //         'Input - Twitter': {
    //           content: input,
    //           sender: author.data.username,
    //           observer: twitterUser,
    //           client: 'twitter',
    //           channel: ev.data.id,
    //           agentId: this.agent.id,
    //           entities,
    //           channelType: 'feed',
    //         },
    //       },
    //       agent: this.agent,
    //       secrets: this.agent.secrets,
    //       publicVariables: this.agent.publicVariables,
    //       runSubspell: true,
    //     })
    //   }
    // })

    try {
      const client = this.twitterv2
      const rules = await client.v2.streamRules()
      if (rules.data?.length) {
        await client.v2.updateStreamRules({
          delete: { ids: rules.data.map(rule => rule.id) },
        })
      }
      const tweetRules = this.twitter_stream_rules.split(',') as any[]
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
      stream.on(ETwitterStreamEvent.Data, async (tw: any) => {
        console.log('TWEET:', tw)
        const isARt =
          tw.data.referenced_tweets?.some(
            tweet => tweet.type === 'retweeted'
          ) ?? false
        console.log('isRt', isARt)
        const isReply =
          tw.data.referenced_tweets &&
          tw.includes &&
          tw.data.referenced_tweets !== undefined &&
          tw.includes !== undefined &&
          tw.includes.tweets.length > 0 &&
          tw.includes.tweets[0].author_id === this.localUser.data.id

        console.log('isReply', isReply)
        if (
          isARt ||
          isReply ||
          (this.localUser !== undefined &&
            tw.data.author_id == this.localUser.data.id)
        ) {
          return
        } else {
          if (!this.regexMatch(regex, tw.data.text)) {
            return
          } else {
            if (!this.twitterv2) {
              return console.log('Twitter not initialized properly')
            }

            // const author = await this.twitterv2.v2.user(tw.data.author_id)
            // const entities = [author.data.name, twitterUser]
            // const resp = await this.spellRunner.runComponent({
            //   inputs: {
            //     'Input - Twitter (Feed)': {
            //       content: tw.data.text,
            //       sender: author.data.username,
            //       observer: twitterUser,
            //       client: 'twitter',
            //       channel: tw.data.id,
            //       agentId: this.agent.id,
            //       entities,
            //       channelType: 'feed',
            //       rawData: tw
            //     },
            //   },
            //   agent: this.agent,
            //   secrets: this.agent.secrets,
            //   publicVariables: this.agent.publicVariables,
            //   app,
            //   runSubspell: true,
            // })
          }
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  async handleMessage(response, chat_id, args) {
    console.log('handleMessage', response)
    if (args === 'DM') {
      await this.twitterv1?.v1.sendDm({
        recipient_id: chat_id,
        text: response,
      })
    } else if (args === 'feed') {
      // if the reponse contains a .mpeg file, remove it from the response and send it as a media file
      // extract the url from the response
      // example url: https://vkzhmwivieetdcbhmszr.supabase.co/storage/v1/object/public/avatars/b01edaa9-fe38-49ff-9967-19ff7054e884.mpeg
      const url = 'https://' + response.split('https://')[1].split(' ')[0]
      // remove the url from the response
      response = response.replace(url, '')

      const myHeaders = new Headers()
      myHeaders.append(
        'Authorization',
        'OAuth oauth_consumer_key="CupzSclhst4JHNiAVNCjG4ELl",oauth_token="1353431250942345216-YFex3qwZcFpVROuddZT3QwZCzsXiRo",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1680360543",oauth_nonce="6MInAlduEhc",oauth_version="1.0",oauth_signature="rzwI%2BS6udm51%2FG50rFmaTpD7Dcw%3D"'
      )
      myHeaders.append('Content-Type', 'application/json')
      myHeaders.append(
        'Cookie',
        'guest_id=v1%3A168036046706659992; guest_id_ads=v1%3A168036046706659992; guest_id_marketing=v1%3A168036046706659992; personalization_id="v1_Nob/3R0lxyldHjTRRDV7pw=="'
      )

      const raw = JSON.stringify({
        text: response + '\n' + url,
        reply: {
          in_reply_to_tweet_id: chat_id,
        },
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      }

      fetch('https://api.twitter.com/2/tweets', requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error))
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
}

function getSetting(setting, settingName) {
  if (!setting || setting === '') {
    console.warn(`Could not get Twitter setting for '${settingName}'`)
    return null
  }
  return setting
}
