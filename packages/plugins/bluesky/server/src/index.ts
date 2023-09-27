import { eventSocket, ServerPlugin, triggerSocket } from 'shared/core'

let BlueskyConnector = null as any
// dynamically import { BlueskyConnector } from './connectors/bluesky' if we are in node.js using esm syntax
if (typeof window === 'undefined') {
  import('./connectors/bluesky').then(module => {
    BlueskyConnector = module.BlueskyConnector
  })
}

type StartBlueskyArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startBluesky({ agent, spellRunner }: StartBlueskyArgs) {
    const { data } = agent.data
    if (!data) return console.log('No data for this agent')
    if (!data.bluesky_enabled)
      return console.log('Bluesky is not enabled for this agent')
    const bluesky = new BlueskyConnector({
      agent,
      spellRunner,
    })
    agent.bluesky = bluesky
  }

  async function stopBluesky({ agent }) {
    if (!agent.bluesky)
      return console.warn("Bluesky isn't running, can't stop it")
    try {
      await agent.bluesky.destroy()
      agent.bluesky = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped bluesky client for agent ' + agent.name)
  }

  return {
    start: startBluesky,
    stop: stopBluesky,
  }
}

async function handleResponse({ output, agent, event }) {
  console.log('********* SENT MESSAGE TO BLUESKY', agent.id, output, event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    await agent.bluesky.handleResponse(resp, event)
  }
}

async function handlePost({ output, agent, event }) {
  console.log('********* SENT MESSAGE TO BLUESKY', agent.id, output, event)
  console.log('event is', event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    await agent.bluesky.handlePost(resp)
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

const BlueskyPlugin = new ServerPlugin({
  name: 'BlueskyPlugin',
  inputTypes: [
    {
      name: 'Bluesky (Reply)',
      sockets: inputSockets,
      defaultResponseOutput: 'Bluesky (Reply)',
    },
    {
      name: 'Bluesky (Mention)',
      sockets: inputSockets,
      defaultResponseOutput: 'Bluesky (Mention)',
    },
  ],
  outputTypes: [
    {
      name: 'Bluesky (Reply)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Bluesky (Mention)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
    {
      name: 'Bluesky (Post)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handlePost({ output, agent, event })
      },
    },
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'User ID',
      key: 'bluesky_identifier',
      global: false,
    },
    {
      name: 'Password',
      key: 'bluesky_password',
      global: false,
    },
  ],
})

export default BlueskyPlugin
