// DOCUMENTED 
import { TwitterApi, ETwitterStreamEvent } from 'twitter-api-v2'

/**
 * TwitterConnector Class for handling Twitter API operations.
 */
export class TwitterConnector {
  twitterv1: TwitterApi | undefined;
  twitterv2: TwitterApi | undefined;
  twitterv2_replies: TwitterApi | undefined;
  spellRunner;
  data;
  agent;
  twitter_stream_rules = '';
  localUser: any;
  worldManager: any;

  /**
   * Constructor for TwitterConnector.
   * @param {Object} param0 - An object containing spellRunner, agent, and worldManager.
   */
  constructor({ spellRunner, agent, worldManager }) {
    agent.twitter = this;
    this.spellRunner = spellRunner;
    const data = agent.data.data;
    this.data = data;
    this.agent = agent;
    this.worldManager = worldManager;
    console.log(data);
    if (!data.twitter_enabled) {
      console.warn('Twitter is not enabled, skipping');
      return;
    }
    this.twitter_stream_rules = data.twitter_stream_rules;

    const bearerToken = getSetting(
      data.twitter_bearer_token,
      'Bearer Token (Twitter API V2)'
    );
    const twitterUser = getSetting(data.twitter_userid, 'User ID (@)');
    const twitterApiKey = getSetting(data.twitter_api_key, 'API Key');
    const twitterApiKeySecret = getSetting(
      data.twitter_api_key_secret,
      'API Key Secret'
    );
    const twitterAccessToken = getSetting(
      data.twitter_access_token,
      'Access Token'
    );
    const twitterAccessTokenSecret = getSetting(
      data.twitter_access_token_secret,
      'Access Token Secret'
    );

    const streamRules = getSetting(data.twitter_stream_rules, 'Stream Rules');

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
      );
      return;
    }

    this.twitterv1 = new TwitterApi({
      appKey: twitterApiKey,
      appSecret: twitterApiKeySecret,
      accessToken: twitterAccessToken,
      accessSecret: twitterAccessTokenSecret,
    });

    this.twitterv2 = new TwitterApi(bearerToken);
    this.twitterv2_replies = new TwitterApi(bearerToken);
    console.log('Initializing Twitter...');
    this.initialize({ data });
  }

  /**
   * Initialize the Twitter API.
   * @param {Object} param0 - An object containing data.
   */
  async initialize({ data }) {
    if (!this.twitterv2 || !this.twitterv2_replies) {
      return console.log('Twitter not initialized properly');
    }

    const twitterUser = getSetting(data.twitter_userid, 'User ID (@)');

    this.localUser = await this.twitterv2.v2.userByUsername(twitterUser);

    console.log('twitterUser', data.twitter_userid);

    try {
      const client = this.twitterv2;
      const rules = await client.v2.streamRules();
      if (rules.data?.length) {
        await client.v2.updateStreamRules({
          delete: { ids: rules.data.map(rule => rule.id) },
        });
      }
      const tweetRules = this.twitter_stream_rules.split(',') as any[];
      const _rules = [] as any[];
      const regex = [] as any[];
      for (const x in tweetRules) {
        _rules.push({ value: tweetRules[x] });
        regex.push(tweetRules[x]);
      }
      await client.v2.updateStreamRules({
        add: _rules,
      });
      const stream = await client.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id'],
      });
      stream.autoReconnect = true;
      stream.on(ETwitterStreamEvent.Data, async (tw: any) => {
        console.log('TWEET:', tw);
        const isARt =
          tw.data.referenced_tweets?.some(
            tweet => tweet.type === 'retweeted'
          ) ?? false;
        console.log('isRt', isARt);
        
        const isReply =
          tw.data.referenced_tweets &&
          tw.includes &&
          tw.data.referenced_tweets !== undefined &&
          tw.includes !== undefined &&
          tw.includes.tweets.length > 0 &&
          tw.includes.tweets[0].author_id === this.localUser.data.id;

        console.log('isReply', isReply);
        
        if (
          isARt ||
          isReply ||
          (this.localUser !== undefined &&
            tw.data.author_id == this.localUser.data.id)
        ) {
          return;
        } else {
          if (!this.regexMatch(regex, tw.data.text)) {
            return;
          } else {
            if (!this.twitterv2) {
              return console.log('Twitter not initialized properly');
            }

            const author = await this.twitterv2.v2.user(tw.data.author_id);
            const entities = [author.data.name, twitterUser];
            const resp = await this.spellRunner.runComponent({
              inputs: {
                'Input - Twitter (Feed)': {
                  content: tw.data.text,
                  sender: author.data.name,
                  observer: twitterUser,
                  client: 'twitter',
                  channel: tw.data.id,
                  agentId: this.agent.id,
                  entities,
                  channelType: 'feed',
                },
              },
              agent: this.agent,
              secrets: this.agent.secrets,
              publicVariables: this.agent.publicVariables,
              runSubspell: true,
            });
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Handle message response based on the type (DM or feed).
   * @param {string} response - The message to be sent.
   * @param {string} chat_id - The ID of the chat where the message will be sent.
   * @param {string} args - The type of message ('DM' or 'feed').
   */
  async handleMessage(response, chat_id, args) {
    console.log('handleMessage', response);
    if (args === 'DM') {
      await this.twitterv1?.v1.sendDm({
        recipient_id: chat_id,
        text: response,
      });
    } else if (args === 'feed') {
      await this.twitterv1?.v1.reply(response, chat_id);
    }
  }

  /**
   * Check if input matches any of the provided regexes.
   * @param {string[]} regexes - An array of regex strings to match against input.
   * @param {string} input - The input string to check against regexes.
   * @returns {boolean} - True if any regex matches the input, false otherwise.
   */
  regexMatch(regexes: string[], input: string): boolean {
    if (!input || input?.length <= 0) {
      return false;
    }

    for (let i = 0; i < regexes.length; i++) {
      if (input.match(regexes[i])) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Get the specified setting value or return null if not found.
 * @param {string} setting - The setting to be retrieved.
 * @param {string} settingName - The name of the setting.
 * @returns {string|null} - The value of the setting or null if not found.
 */
function getSetting(setting, settingName) {
  if (!setting || setting === '') {
    console.warn(`Could not get Twitter setting for '${settingName}'`);
    return null;
  }
  return setting;
}