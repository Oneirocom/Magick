import { eventSocket, ServerPlugin, triggerSocket, WorldManager } from '@magickml/core'

let BlueskyConnector = null as any;
// dynamically import { BlueskyConnector } from './connectors/email' if we are in node.js using esm syntax
if(typeof window === 'undefined') {
  import('./connectors/email').then((module) => {
    BlueskyConnector = module.BlueskyConnector
  })
}

type StartBlueskyArgs = {
  agent: any
  spellRunner: any
  worldManager: WorldManager
}

function getAgentMethods() {
  async function startBluesky({
    agent,
    spellRunner,
    worldManager,
  }: StartBlueskyArgs) {
    const { data } = agent.data
    if(!data) return console.log("No data for this agent")
    if(!data.email_enabled) return console.log("Email is not enabled for this agent")
    const email = new BlueskyConnector({
      agent,
      spellRunner,
      worldManager,
    })
    agent.email = email
  }

  async function stopBluesky({agent}) {
    if (!agent.email) return console.warn("Email isn't running, can't stop it")
    try {
      await agent.email.destroy()
      agent.email = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped email client for agent ' + agent.name)
  }

  return {
    start: startBluesky,
    stop: stopBluesky,
  }
}

async function handleResponse(
  {
    output,
    agent,
    event
  }
) {
  console.log('********* SENT MESSAGE TO BLUESKY', agent.id, output, event)
  console.log('event is', event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    await agent.email.handleResponse(resp, event)
  }
}

async function handlePost(
  {
    output,
    agent,
    event
  }
) {
  console.log('********* SENT MESSAGE TO BLUESKY', agent.id, output, event)
  console.log('event is', event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    await agent.email.handlePost(resp)
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
  }
]

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  }
]

const BlueskyPlugin = new ServerPlugin({
  name: 'BlueskyPlugin',
  inputTypes: [
    { name: 'Email (Reply)', sockets: inputSockets, defaultResponseOutput: 'Email (Reply)' },
    { name: 'Email (Mention)', sockets: inputSockets, defaultResponseOutput: 'Email (Mention)' }
  ],
  outputTypes: [
    { name: 'Email (Reply)', sockets: outputSockets, handler: async ({
      output, agent, event
    }) => {
      await handleResponse({output, agent, event})
    }},
    { name: 'Email (Mention)', sockets: outputSockets, handler: async ({
      output, agent, event
    }) => {
      await handleResponse({output, agent, event})
    }},
    { name: 'Email (Post)', sockets: outputSockets, handler: async ({
      output, agent, event
    }) => {
      await handlePost({output, agent, event})
    }},
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'User ID',
      key: 'email_identifier',
      global: false,
    },
    {
      name: 'Password',
      key: 'email_password',
      global: false,
    },
  ],
})

export default BlueskyPlugin
