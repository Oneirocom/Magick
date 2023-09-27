import { eventSocket, ServerPlugin, triggerSocket } from 'shared/core'

let TwitterConnector = null as any
// dynamically import { TwitterConnector } from './connectors/twitter' if we are in node.js using esm syntax
if (typeof window === 'undefined') {
  import('./connectors/twitter').then(module => {
    TwitterConnector = module.TwitterConnector
  })
}

type StartTwitterArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startTwitter({ agent, spellRunner }: StartTwitterArgs) {
    const { data } = agent.data
    if (!data) return console.log('No data for this agent')
    if (!data.twitter_enabled)
      return console.log('Twitter is not enabled for this agent')
    if (!data.twitter_api_key)
      return console.log('Twitter API key is not set for this agent')
    console.log('starting twitter connect')
    const twitter = new TwitterConnector({
      agent,
      spellRunner,
    })
    agent.twitter = twitter
  }

  async function stopTwitter({ agent }) {
    if (!agent.twitter)
      return console.warn("Twitter isn't running, can't stop it")
    try {
      await agent.twitter.destroy()
      agent.twitter = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped twitter client for agent ' + agent.name)
  }

  return {
    start: startTwitter,
    stop: stopTwitter,
  }
}

async function handleResponse({ output, agent, event }) {
  if (!event.channel) {
    console.log('No channel to send to')
    return
  }

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    if (resp === 'like' || resp === 'heart') {
      await agent.twitter.twitterv2.v2.like(
        agent.twitter.localUser.data.id,
        event.channel
      )
    } else if (resp === 'retweet') {
      await agent.twitter.twitterv2.v2.retweet(
        agent.twitter.localUser.data.id,
        event.channel
      )
    } else if (resp !== 'ignore') {
      await agent.twitter.handleMessage(resp, event)
    }
  }
}

const inputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
  {
    socket: 'trigger',
    name: 'trigger',
    type: triggerSocket,
  },
]

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  },
]

const TwitterPlugin = new ServerPlugin({
  name: 'TwitterPlugin',
  inputTypes: [
    {
      name: 'Twitter (Feed)',
      sockets: inputSockets,
      defaultResponseOutput: 'Twitter (Feed)',
    },
    { name: 'Twitter (DM)', defaultResponseOutput: 'Twitter (DM)' },
    // { name: 'Twitter (Mention', trigger: true, socket: eventSocket, defaultResponseOutput: 'Twitter (Mention'}
  ],
  outputTypes: [
    {
      name: 'Twitter (Feed)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Twitter (DM)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Bearer Token (API v2)',
      key: 'twitter_bearer_token',
      global: false,
    },
    {
      name: 'API Key (API v1)',
      key: 'twitter_api_key',
      global: false,
    },
    {
      name: 'API Key Secret (API v1)',
      key: 'twitter_api_key_secret',
      global: false,
    },
    {
      name: 'Access Token (API v1)',
      key: 'twitter_access_token',
      global: false,
    },
    {
      name: 'Access Token Secret (API v1)',
      key: 'twitter_access_token_secret',
      global: false,
    },
  ],
})

export default TwitterPlugin
