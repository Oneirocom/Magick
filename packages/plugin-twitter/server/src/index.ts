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

    console.log('starting twitter')
      // const {
      // twitter_app_key,
      // twitter_app_secret
      // twitter_access_token,
      // twitter_access_secret,
      // } = data

    const twitter = new TwitterConnector({
      ...data,
      agent,
      spellRunner,
      worldManager,
    })
    agent.twitter = twitter
  }

  async function stopTwitter({agent}) {
    console.log('**************** STOPPING DISCORD')
    console.log('Inside Kill Method')
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
  console.log('event is', event)
  console.log('event.channel is', event.channel)
  await agent.twitter.sendMessageToChannel(event.channel, output)
  console.log('********* SENT MESSAGE TO DISCORD', agent.id, output, event)
}

const TwitterPlugin = new ServerPlugin({
  name: 'TwitterPlugin',
  inputTypes: [
    { name: 'Twitter (Voice)', trigger: true, socket: eventSocket, defaultResponseOutput: 'Twitter (Voice)' },
    { name: 'Twitter (Text)', trigger: true, socket: eventSocket, defaultResponseOutput: 'Twitter (Text)' },
  ],
  outputTypes: [
    { name: 'Twitter (Voice)', trigger: true, socket: eventSocket, handler: async ({
      output, agent, event
    }) => {
      await handleResponse({output, agent, event})
    }},
    { name: 'Twitter (Text)', trigger: true, socket: eventSocket, handler: async ({
      output, agent, event
    }) => {
      console.log('output is', output)
      await handleResponse({output, agent, event})
    }},
  ],
  agentMethods: getAgentMethods(),
  secrets: [{
    name: 'Twitter API Key',
    key: 'twitter_api_key',
    global: false
  }]
})

export default TwitterPlugin
