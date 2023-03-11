import { eventSocket, ServerPlugin, WorldManager } from '@magickml/engine'
import { TwitterConnector } from './connectors/twitter'
type StartTwitterArgs = {
  agent: any
  spellRunner: any
  worldManager: WorldManager
}

function getAgentMethods() {
  async function startTwitter({
    agent,
    spellRunner,
    worldManager,
  }: StartTwitterArgs) {
    const { data } = agent.data
    if(!data) return console.log("No data for this agent")
    console.log('data', data)
    if(!data.twitter_enabled) return console.log("Twitter is not enabled for this agent")
    if(!data.twitter_api_key) return console.log("Twitter API key is not set for this agent")

    const twitter = new TwitterConnector({
      ...data,
      agent,
      spellRunner,
      worldManager,
    })
    agent.twitter = twitter
  }

  async function stopTwitter({agent}) {
    if (!agent.twitter) return console.warn("Twitter isn't running, can't stop it")
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

async function handleResponse(
  {
    output,
    agent,
    event
  }
) {
  console.log('********* SENT MESSAGE TO TWITTER', agent.id, output, event)
  console.log('event is', event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    if (resp === 'like' || resp === 'heart') {
      await agent.twitter.twitterv2.v2.like(agent.twitter.localUser.data.id, event.channel)
    } else if (resp !== 'ignore') {
      await agent.twitter.handleMessage(resp, event.channel, 'feed')
    } else if (resp === 'retweet') {
      await agent.twitter.twitterv2.v2.retweet(agent.twitter.localUser.data.id, event.channel)
    }
  }
}

const TwitterPlugin = new ServerPlugin({
  name: 'TwitterPlugin',
  inputTypes: [
    { name: 'Twitter (Feed)', trigger: true, socket: eventSocket, defaultResponseOutput: 'Twitter (Feed)' },
    { name: 'Twitter (DM)', trigger: true, socket: eventSocket, defaultResponseOutput: 'Twitter (DM)' },
  ],
  outputTypes: [
    { name: 'Twitter (Feed)', trigger: true, socket: eventSocket, handler: async ({
      output, agent, event
    }) => {
      await handleResponse({output, agent, event})
    }},
    { name: 'Twitter (DM)', trigger: true, socket: eventSocket, handler: async ({
      output, agent, event
    }) => {
      await handleResponse({output, agent, event})
    }},
  ],
  agentMethods: getAgentMethods(),
  secrets: [
  {
    name: 'Bearer Token (API v2)',
    key: 'twitter_bearer_token',
    global: false
  },
  {
    name: 'App Token (API v1)',
    key: 'twitter_app_token',
    global: false
  },
  {
    name: 'App Token Secret (API v1)',
    key: 'twitter_app_token_secret',
    global: false
  },
  {
    name: 'Access Token (API v1)',
    key: 'twitter_access_token',
    global: false
  },
  {
    name: 'Access Token Secret (API v1)',
    key: 'twitter_access_token_secret',
    global: false
  },
]
})

export default TwitterPlugin
