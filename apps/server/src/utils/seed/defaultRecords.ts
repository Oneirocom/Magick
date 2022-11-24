import { AddClient, AddScope } from 'src/routes/settings/types'

export const defaultClientData: AddClient[] = [
  {
    client: 'Discord',
    name: 'discord_api_token',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterConsumerKey',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterConsumerSecret',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterAccessToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterAccessTokenSecret',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'ngrokToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterWebhookPort',
    type: 'string',
    defaultValue: '3002',
  },
  {
    client: 'twitter',
    name: 'twitterID',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterBearerToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twitter',
    name: 'twitterTweetRules',
    type: 'string',
    defaultValue: 'digital,being,digital being',
  },
  {
    client: 'discord',
    name: 'loadDiscordLogger',
    type: 'string',
    defaultValue: false,
  },
  {
    client: 'twilio',
    name: 'twilioAccountSID',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twilio',
    name: 'twiolioPhoneNumber',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twilio',
    name: 'twiolioAuthToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'twilio',
    name: 'twiolioPhoneNumber',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'telegram',
    name: 'telegramBotToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'xr-engine',
    name: 'xrEngineURL',
    type: 'string',
    defaultValue: 'https://dev.theoverlay.io/location/bot',
  },
  {
    client: 'whatsapp',
    name: 'whatsappBotName',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'harmony',
    name: 'harmonyURL',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'zoom',
    name: 'zoomInvitationLink',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'zoom',
    name: 'zoomPassword',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'messenger',
    name: 'messengertoken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'messenger',
    name: 'messengerVerifyToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'reddit',
    name: 'redditAppID',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'reddit',
    name: 'redditAppSecretID',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'reddit',
    name: 'redditUsername',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'reddit',
    name: 'redditPassword',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'reddit',
    name: 'redditOAthToken',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'instagram',
    name: 'instagramUsername',
    type: 'string',
    defaultValue: '',
  },
  {
    client: 'instagram',
    name: 'instagramPassword',
    type: 'string',
    defaultValue: '',
  },
]

export const defaultConfiguationData: any = {
  ball: 'football',

  whatsappBotName: '',

  harmonyURL: '',

  zoomInvitationLink: '',
  zoomPassword: '',
  messengerToken: '',

  messengerVerifyToken: '',

  botNameRegex: '((?:digital|being)(?: |$))',

  chatHistoryMessagesCount: 20,

  botName: 'digital being',

  botNameHandler: 'digital being',

  digitalBeingsOnly: false,
  redditAppID: '',
  redditAppSecretID: '',

  redditUsername: '',
  redditPassword: '',

  redditOAthToken: '',
  instagramUsername: '',
  instagramPassword: '',
  fastMode: false,

  discord_calendar_channel: '',
  discussion_channel_topics: 'Apples|Trees|Space|Universe',
  use_logtail: false,
  logtail_key: '',
  initCalendar: false,

  enabledServices: 'Discord',

  agent: 'Thales',

  openai_api_key: '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',

  google_project_id: '',

  hf_api_token: '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',

  use_gptj: false,

  discord_api_token: '',

  twitterConsumerKey: '',

  twitterConsumerSecret: '',

  twitterAccessToken: '',
  twitterAccessTokenSecret: '',

  ngrokToken: '',
  twitterWebhookPort: 3002,

  twitterID: '',

  twitterBearerToken: '',

  twitterTweetRules: 'digital,being,digital being',

  loadDiscordLogger: false,

  editMessageMaxCount: 5,

  logDMUserID: '',

  twilioAccountSID: '',

  twiolioPhoneNumber: '',

  twiolioAuthToken: '',

  telegramBotToken: '',
}

export const defaultScopeData: AddScope[] = [
  {
    tables: '43 tables',
    fullTableSize: '1.8MB',
    tableSize: '792 KB',
    recordCount: 0,
  },
  {
    tables: '_3d_world_understanding_prompt',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'actions',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'agent_config',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'agent_fact_summarization',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'agent_facts',
    fullTableSize: '72 KB',
    tableSize: '40 KB',
    recordCount: 3,
  },
  {
    tables: 'agent_facts_archive',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'agents_instance',
    fullTableSize: '! KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'agents',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 3,
  },
  {
    tables: 'bad_words',
    fullTableSize: '80 KB',
    tableSize: '48 KB',
    recordCount: 0,
  },
  {
    tables: 'blocked users',
    fullTableSize: '0 Bytes',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'chat_history',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'client_settings',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'config',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'context',
    fullTableSize: '48KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'conversation',
    fullTableSize: '368KB',
    tableSize: '336KB',
    recordCount: 20,
  },
  {
    tables: 'dialogue',
    fullTableSize: '72 KB',
    tableSize: '40 KB',
    recordCount: 3,
  },
  {
    tables: 'ethics',
    fullTableSize: '16 MB',
    tableSize: '8 KB',
    recordCount: 3,
  },
  {
    tables: 'facts',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'ignored_keywords',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'keywords',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'leading_statements',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'meta',
    fullTableSize: '64 KB',
    tableSize: '24 KB',
    recordCount: 4,
  },
  {
    tables: 'monologue',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'morals',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'needs_motivations',
    fullTableSize: '48 KB',
    tableSize: '16 KB',
    recordCount: 3,
  },
  {
    tables: 'opinion_form_prompt',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'personality',
    fullTableSize: '48 KB',
    tableSize: '16 KB',
    recordCount: 3,
  },
  {
    tables: 'personality_questions',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'profane_responses',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'rating',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'relationship_matrix',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'room',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'sensitive_phrases',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'sensitive_response',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'sensitive_words',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'speaker_fact_summarization',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'speaker_profan_responses',
    fullTableSize: '48 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'speaker_facts',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'speaker_facts_archive',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'speaker_model',
    fullTableSize: '8 KB',
    tableSize: '0 Bytes',
    recordCount: 0,
  },
  {
    tables: 'starting_messages',
    fullTableSize: '48 kB',
    tableSize: '8 KB',
    recordCount: 0,
  },
  {
    tables: 'wikipedia',
    fullTableSize: '96 KB',
    tableSize: '64 KB',
    recordCount: 0,
  },
  {
    tables: 'xr_engine_room_prompt',
    fullTableSize: '16 KB',
    tableSize: '8 KB',
    recordCount: 0,
  },
]
