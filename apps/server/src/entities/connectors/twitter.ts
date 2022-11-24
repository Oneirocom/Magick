/* eslint-disable prefer-const */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { database } from '../../database'
import { TwitterApi, ETwitterStreamEvent } from 'twitter-api-v2'

import { randomInt } from './utils'

function log(...s: (string | boolean)[]) {
  console.log(...s)
}

const createTwitterClientV1 = (
  appKey: string,
  appSecret: string,
  accessToken: string,
  accessSecret: string
) => {
  return new TwitterApi({
    appKey: appKey,
    appSecret: appSecret,
    accessToken: accessToken,
    accessSecret: accessSecret,
  })
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

const createTwitterClientV2 = (bearerKey: string) => {
  return new TwitterApi(bearerKey)
}

export class twitter_client {
  automatic_tweet = async spellHandler => {
    const interval =
      randomInt(
        this.twitter_auto_tweet_interval_min,
        this.twitter_auto_tweet_interval_max
      ) * 60000
    console.log('await interval:', interval)
    await sleep(interval)

    const resp = await spellHandler(
      '',
      'user',
      this.settings.twitter_bot_name ?? 'Agent',
      'twitter',
      'auto_tweet',
      this.settings.entity,
      [],
      'auto'
    )
    console.log('generated automatic tweet:', resp)

    this.twitterv1.v1.tweet(resp)
    this.automatic_tweet(spellHandler)
  }

  async handleMessage(response, chat_id, args) {
    if (args === 'DM') {
      const dmSent = await this.twitterv1.v1.sendDm({
        recipient_id: chat_id,
        text: response,
      })
    } else if (args === 'Twit') {
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
  spellHandler
  spellHandlerAuto
  settings
  entity
  twitter_enable_twits: boolean = false
  twitter_tweet_rules: string = ''
  twitter_auto_tweet_interval_min: number = 0
  twitter_auto_tweet_interval_max: number = 0

  createTwitterClient = async (
    spellHandler,
    spellHandlerAuto,
    settings,
    entity
  ) => {
    this.spellHandler = spellHandler
    this.spellHandlerAuto = spellHandlerAuto
    this.settings = settings
    this.entity = entity
    this.twitter_enable_twits =
      settings.twitter_enable_twits === true ||
      settings.twitter_enable_twits === 'true'

    this.twitter_tweet_rules = settings.twitter_tweet_rules
    if (!this.twitter_tweet_rules || this.twitter_tweet_rules?.length === 0) {
      this.twitter_enable_twits = false
    }

    const temp_min = settings.twitter_auto_tweet_interval_min
    const temp_max = settings.twitter_auto_tweet_interval_max

    if (temp_min && temp_min.length > 0) {
      this.twitter_auto_tweet_interval_min = parseInt(temp_min)
    }
    if (temp_max && temp_max.length > 0) {
      this.twitter_auto_tweet_interval_max = parseInt(temp_max)
    }

    const bearerToken = settings.twitter_token
    const twitterUser = settings.twitter_id
    const twitterAppToken = settings.twitter_app_token
    const twitterAppTokenSecret = settings.twitter_app_token_secret
    const twitterAccessToken = settings.twitter_access_token
    const twitterAccessTokenSecret = settings.twitter_access_token_secret

    if (
      !bearerToken ||
      !twitterAppToken ||
      !twitterAppTokenSecret ||
      !twitterAccessToken ||
      !twitterAccessTokenSecret ||
      !twitterUser
    )
      return console.warn('No API token for Twitter bot, skipping')

    this.twitterv1 = createTwitterClientV1(
      twitterAppToken,
      twitterAppTokenSecret,
      twitterAccessToken,
      twitterAccessTokenSecret
    )

    this.twitterv2 = createTwitterClientV2(bearerToken)
    this.twitterv2_replies = createTwitterClientV2(bearerToken)
    const localUser = await this.twitterv2.v2.userByUsername(twitterUser)
    setInterval(async () => {
      try {
        const eventsPaginator = await this.twitterv1.v1.listDmEvents()
        for await (const event of eventsPaginator) {
          if (event.type == 'message_create') {
            if (event.message_create.sender_id == localUser.data.id) {
              return
            }
            const handled: boolean = await database.instance.dataIsHandled(
              event.id,
              'twitter_dm'
            )

            if (!handled) {
              let authorName = 'Sender'
              const author = await this.twitterv2.v2.user(
                event.message_create.sender_id
              )
              if (author) authorName = author.data.username

              const body = event.message_create.message_data.text

              if (authorName === 'alextitonis') {
                const resp = await this.spellHandler(
                  body,
                  authorName,
                  this.settings.twitter_bot_name ?? 'Agent',
                  'twitter',
                  event.id,
                  settings.entity,
                  [],
                  'dm'
                )
                if (resp && resp?.length > 0) {
                  await this.handleMessage(resp, author.data.id, 'DM')
                }

                await database.instance.setDataHandled(event.id, 'twitter_dm')
              }
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }, 25000)


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
        twit.includes.tweets[0].author_id == localUser.data.id &&
        twit.data.author_id !== localUser.data.id &&
        twit.data.text.startsWith('@' + localUser.data.username)
      ) {
        console.log(twit.data)
        console.log(twit.includes)
        const handled: boolean = await database.instance.dataIsHandled(
          twit.data.id,
          'twitter'
        )
        if (!handled) {
          const author = await this.twitterv2.v2.user(twit.data.author_id)

          const input = twit.data.text.replace(
            '@' + localUser.data.username,
            ''
          )
          const resp = await this.spellHandler(
            input,
            author.data.name,
            this.settings.twitter_bot_name ?? 'Agent',
            'twitter',
            twit.data.id,
            settings.entity,
            [],
            'tweet'
          )

          if (resp && resp !== undefined && resp?.length > 0) {
            if (resp === 'like' || resp === 'heart') {
              await this.twitterv2.v2.like(localUser.data.id, twit.data.id)
            } else if (resp !== 'ignore') {
              await this.handleMessage(resp, twit.data.id, 'Twit')
            } else if (resp === 'retweet') {
              await this.twitterv2.v2.retweet(localUser.data.id, twit.data.id)
            }
          }

          database.instance.setDataHandled(twit.data.id, 'twitter')
        }
      }
    })

    if (
      this.twitter_auto_tweet_interval_min > 0 &&
      this.twitter_auto_tweet_interval_max > 0 &&
      this.twitter_auto_tweet_interval_min <
      this.twitter_auto_tweet_interval_max
    ) {
      try {
        this.automatic_tweet(spellHandlerAuto)
      } catch (e) {
        console.log(e)
      }
    }

    if (this.twitter_enable_twits) {
      try {
        const client = this.twitterv2
        const rules = await client.v2.streamRules()
        if (rules.data?.length) {
          await client.v2.updateStreamRules({
            delete: { ids: rules.data.map(rule => rule.id) },
          })
        }
        const tweetRules = this.twitter_tweet_rules.split(',')
        const _rules = []
        const regex = []
        for (let x in tweetRules) {
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
            twit.includes.tweets[0].author_id == localUser.data.id

          if (
            isARt ||
            isReply ||
            (localUser !== undefined &&
              twit.data.author_id == localUser.data.id)
          ) {
          } else {
            if (!this.regexMatch(regex, twit.data.text)) {
            } else {
              let authorName = 'unknown'
              const author = await this.twitterv2.v2.user(twit.data.author_id)
              if (author) authorName = author.data.username

              const handled: boolean = await database.instance.dataIsHandled(
                twit.data.id,
                'twitter'
              )

              if (!handled) {
                const resp = await this.spellHandler(
                  twit.data.text,
                  author.data.name,
                  this.settings.twitter_bot_name ?? 'Agent',
                  'twitter',
                  twit.data.id,
                  settings.entity,
                  [],
                  'tweet'
                )

                if (resp && resp !== undefined && resp?.length > 0) {
                  if (resp === 'like' || resp === 'heart') {
                    await this.twitterv2.v2.like(
                      localUser.data.id,
                      twit.data.id
                    )
                  } else if (resp !== 'ignore') {
                    await this.handleMessage(resp, twit.data.id, 'Twit')
                  } else if (resp === 'retweet') {
                    await this.twitterv2.v2.retweet(
                      localUser.data.id,
                      twit.data.id
                    )
                  }
                }

                database.instance.setDataHandled(twit.data.id, 'twitter')
              }
            }
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
