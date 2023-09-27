import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2'
import { DMEventV2 } from 'twitter-api-v2/dist/esm/types/v2/dm.v2.types'
import { app } from 'server/core'

export class TwitterConnector {
  twitterv1: TwitterApi | undefined
  twitterv2: TwitterApi | undefined
  spellRunner
  data
  agent
  twitter_stream_rules = ''
  localUser: any
  dmHandler: any
  stream: any
  senderIds = {}

  constructor({ agent }) {
    agent.twitter = this
    const data = agent.data.data
    this.data = data
    this.agent = agent
    if (!data.twitter_enabled) {
      console.warn('Twitter is not enabled, skipping')
      return
    }

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

    try {
      const client = this.twitterv2
      if (this.data.twitter_feed_enable) {
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

          app.get('agentCommander').runSpell({
            agent: this.agent,
            agentId: this.agent.id,
            spellId: this.agent.rootSpellId,
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
            runSubspell: true,
          })
          // }
        })
      }

      if (this.data.twitter_dms_enable) {
        let lastDmId = null as null | string

        const getDirectMessages = async () => {
          console.log('getting dms')
          // get the dm conversaiton id
          const response = await this.twitterv1?.v2.listDmEvents({
            'user.fields': ['created_at'],
            // @ts-ignore
            'dm_event.fields': ['dm_conversation_id'],
            expansions: ['sender_id'],
          })
          // paginate reponses
          const dmEvents = response?.events as any[]

          // type DMEventV2

          // if the lastDmIdBigInt is null, get the last DM ID and set it
          if (lastDmId === null) {
            console.log('lastDmId is null')
            lastDmId = dmEvents[0].id
            return
          }

          await dmEvents?.forEach(async (event: DMEventV2) => {
            const dmId = event.id
            // Convert IDs to BigInt because Twitter IDs are larger than what JavaScript can handle with normal numbers
            const dmIdBigInt = BigInt(dmId)
            const lastDmIdBigInt = lastDmId ? BigInt(lastDmId) : null

            if (lastDmIdBigInt === null || dmIdBigInt > lastDmIdBigInt) {
              console.log('event', event)
              const message = (event as any).text
              const senderId = event.sender_id as string

              const conversation_id = event.dm_conversation_id
              if (!conversation_id) {
                return console.log('no conversation id')
              }

              let senderUsername = this.senderIds[senderId]
              if (!senderUsername) {
                // get the userid of the senderId
                const sender = await this.twitterv1?.v2.user(senderId as string)

                console.log('sender', sender)

                senderUsername = sender?.data.username
                this.senderIds[senderId] = senderUsername
              }

              console.log(
                `Received a message from ${senderUsername}: ${message}`
              )
              lastDmId = dmId

              // if the dm was sent by the local user, skip
              if (senderId === this.localUser.data.id) {
                return console.log('Skipping DM from self')
              }

              const entities = [] as any[]

              entities.push(senderUsername)

              entities.push(twitterUser)

              await app.get('agentCommander').runSpell({
                agent: this.agent,
                agentId: this.agent.id,
                spellId: this.agent.rootSpellId,
                inputs: {
                  'Input - Twitter (DM)': {
                    connector: 'Twitter (DM)',
                    content: message,
                    sender: senderUsername,
                    observer: twitterUser,
                    client: 'twitter',
                    channel: conversation_id,
                    agentId: this.agent.id,
                    entities,
                    channelType: 'dm',
                    rawData: JSON.stringify(event),
                  },
                },
                secrets: this.agent.secrets,
                publicVariables: this.agent.publicVariables,
                runSubspell: true,
              })
            }
          })
        }

        this.dmHandler = setInterval(
          async () => {
            getDirectMessages()
          }, // interval is 20 requests per minute plus buffer
          1000 * 15
        ) //  seconds

        getDirectMessages()
      }
    } catch (e) {
      console.log(e)
    }
  }

  destroy() {
    if (this.stream) {
      this.stream.close()
    }
    if (this.dmHandler) {
      clearInterval(this.dmHandler)
    }
  }

  async handleMessage(message, event) {
    if (event.channelType === 'dm') {
      const response = await this.twitterv1?.v2.sendDmInConversation(
        event.channel,
        {
          text: message,
        }
      )
      console.log('DM MESSAGE: response', response)
    } else if (event.channelType === 'feed') {
      // Split the response into chunks of complete sentences but less than 280 characters
      const responses = [] as string[]
      const maxChunkSize = 280

      const sentences = message.match(/[^.!?]+[.!?]+/g) || []

      let currentChunk = ''
      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length <= maxChunkSize) {
          currentChunk += sentence
        } else {
          responses.push(currentChunk.trim())
          currentChunk = sentence
        }
      }

      if (currentChunk.length > 0) {
        responses.push(currentChunk.trim())
      }

      for (const chunk of responses) {
        await this.twitterv1?.v1.reply(chunk, event.channel)
      }
    } else {
      console.log('Unknown channel type', event.channelType)
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
