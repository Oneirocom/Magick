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
  dmHandler: any
  stream: any

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
    try {
      this.twitterv1 = new TwitterApi({
        appKey: twitterApiKey,
        appSecret: twitterApiKeySecret,
        accessToken: twitterAccessToken,
        accessSecret: twitterAccessTokenSecret,
      })

      this.twitterv2 = new TwitterApi(bearerToken)
      console.log('Initializing Twitter...')
      this.initialize({ data })
    } catch (error) {
      console.log('Error initializing Twitter', error)
    }
  }

  async initialize({ data }) {
    if (!this.twitterv2) {
      return console.log('Twitter not initialized properly with v2')
    }

    const twitterUser = getSetting(data.twitter_userid, 'User ID (@)')

    this.localUser = await this.twitterv2.v2.userByUsername(twitterUser)

    console.log('twitterUser', data.twitter_userid)

    // if (!this.twitterv2_replies) {
    //   return console.log('Twitter not initialized properly')
    // }

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
      this.stream = await client.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id'],
      })
      this.stream.autoReconnect = true
      this.stream.on(ETwitterStreamEvent.Data, async (tw: any) => {
        console.log('new code')
        console.log('TWEET:', tw)
        // if the author_id is the same as the local user, skip
        if (tw.data.author_id === this.localUser.data.id) {
          return console.log('Skipping tweet from self')
        }
        const isARt =
          tw.data.referenced_tweets?.some(
            tweet => tweet.type === 'retweeted'
          ) ?? false
        console.log('isRt', isARt)
        // const isReply =
        //   tw.data.referenced_tweets &&
        //   tw.includes &&
        //   tw.data.referenced_tweets !== undefined &&
        //   tw.includes !== undefined &&
        //   tw.includes.tweets.length > 0 &&
        //   tw.includes.tweets[0].author_id === this.localUser.data.id

        // console.log('isReply', isReply)
        // if (
        //   isARt ||
        //   isReply ||
        //   (this.localUser !== undefined &&
        //     tw.data.author_id == this.localUser.data.id)
        // ) {
        //   return console.log('Skipping retweet')
        // } else {

        console.log('running spellrunner')
        const author = await this.twitterv2?.v2.user(tw.data.author_id)
        if (!author) {
          return console.log('author not found')
        }
        console.log('author is', author)
        console.log('twitterUser is', twitterUser)
        const entities = [author.data.username, twitterUser]

        if (author === twitterUser || author.data.username === twitterUser) {
          return console.warn(
            'Bot was going to reply to self, ignoring tweet:',
            tw.data.text
          )
        }

        await this.spellRunner.runComponent({
          inputs: {
            'Input - Twitter (Feed)': {
              connector: 'Twitter (Feed)',
              content: tw.data.text,
              sender: author.data.username,
              observer: twitterUser,
              client: 'twitter',
              channel: tw.data.id,
              agentId: this.agent.id,
              entities,
              channelType: 'feed',
              rawData: tw,
            },
          },
          agent: this.agent,
          secrets: this.agent.secrets,
          publicVariables: this.agent.publicVariables,
          app: this.agent.app,
          runSubspell: true,
        })
        // }
      })

      let lastDmId = null

      const getDirectMessages = async () => {
        console.log('getting dms')
        const response = await this.twitterv1?.v1.get(
          'direct_messages/events/list.json'
        )

        const dmEvents = response?.events

        console.log('dmEvents', dmEvents)

        // if the lastDmIdBigInt is null, get the last DM ID and set it
        if (lastDmId === null) {
          lastDmId = dmEvents[0].id
          return
        }

        await dmEvents?.forEach(async event => {
          const message = event.message_create.message_data.text
          const senderId = event.message_create.sender_id
          const dmId = event.id

          // Convert IDs to BigInt because Twitter IDs are larger than what JavaScript can handle with normal numbers
          const dmIdBigInt = BigInt(dmId)
          const lastDmIdBigInt = lastDmId ? BigInt(lastDmId) : null

          if (lastDmIdBigInt === null || dmIdBigInt > lastDmIdBigInt) {
            console.log(`Received a message from ${senderId}: ${message}`)
            lastDmId = dmId

            // if the dm was sent by the local user, skip
            if (senderId === this.localUser.data.id) {
              return console.log('Skipping DM from self')
            }

            // {
            //   type: 'message_create',
            //   id: '1663353651874635783',
            //   created_timestamp: '1685409388880',
            //   message_create: { target: [Object], sender_id: '66541460', message_data: [Object] }
            // }
            // the above is the message create object
            // we need to parse to fill out some variables

            // get the id of the conversation to respond to
            const conversationId = event.message_create.sender_id

            const entities = [] as any[]

            // get the username of the sender
            const sender = await this.twitterv2?.v2.user(senderId)
            if (!sender) {
              return console.log('sender not found')
            }

            entities.push(sender.data.username)

            entities.push(twitterUser)

            await this.spellRunner.runComponent({
              inputs: {
                'Input - Twitter (DM)': {
                  connector: 'Twitter (DM)',
                  content: message,
                  sender: sender.data.username,
                  observer: twitterUser,
                  client: 'twitter',
                  channel: conversationId,
                  agentId: this.agent.id,
                  entities,
                  channelType: 'dm',
                  rawData: JSON.stringify(event),
                },
              },
              agent: this.agent,
              secrets: this.agent.secrets,
              publicVariables: this.agent.publicVariables,
              app: this.agent.app,
              runSubspell: true,
            })
          }
        })
      }

      this.dmHandler = setInterval(async () => {
        getDirectMessages()
      }, 65000) //  seconds

      console.log('getDirectMessages()')
      getDirectMessages()
    } catch (e) {
      console.log(e)
    }
  }

  destroy() {
    console.log('calling destroy on twitter')
    if (this.stream) {
      this.stream.close()
    }
    if (this.dmHandler) {
      clearInterval(this.dmHandler)
    }
  }

  async handleMessage(message, chat_id, event) {
    console.log('handleMessage', message)
    if (event.channelType === 'dm') {
      const response = await this.twitterv1?.v1.post(
        'direct_messages/events/new.json',
        {
          event: {
            type: 'message_create',
            message_create: {
              target: { recipient_id: chat_id },
              message_data: { text: message },
            },
          },
        }
      )
      console.log('DM MESSAGE: response', response)
    } else if (event.channelType === 'feed') {
      // if the reponse contains a .mpeg file, remove it from the response and send it as a media file
      // extract the url from the response
      // example url: https://vkzhmwivieetdcbhmszr.supabase.co/storage/v1/object/public/avatars/b01edaa9-fe38-49ff-9967-19ff7054e884.mpeg
      let url = null as null | string
      if (message.includes('https://')) {
        url = 'https://' + message.split('https://')[1].split(' ')[0]
        // remove the url from the response
        message = message.replace(url, '')
      }

      // split the response into chunks of 250 characters or less
      const responses = [] as string[]
      const chunkSize = 250

      for (let i = 0; i < message.length; i += chunkSize) {
        responses.push(message.slice(i, i + chunkSize))
      }

      console.log('responses', responses)

      for (const chunk of responses) {
        console.log('chunk', chunk)

        const res = await this.twitterv1?.v1.reply(chunk, chat_id)
        console.log('res is', res)
      }
    }
  }
}

function getSetting(setting, settingName) {
  if (!setting || setting === '') {
    console.warn(`Could not get Twitter setting for '${settingName}'`)
    return null
  }
  return setting
}
