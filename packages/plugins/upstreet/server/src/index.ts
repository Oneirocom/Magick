import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core'

let UpstreetConnector = null as any
// dynamically import { UpstreetConnector } from './connectors/upstreet' if we are in node.js using esm syntax
if (typeof window === 'undefined') {
  import('./connectors/upstreet').then(module => {
    UpstreetConnector = module.UpstreetConnector
  })
}

type StartUpstreetArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startUpstreet({ agent, spellRunner }: StartUpstreetArgs) {
    const { data } = agent.data
    if (!data) return console.log('No data for this agent')
    if (!data.upstreet_enabled)
      return console.log('Upstreet is not enabled for this agent')
    const upstreet = new UpstreetConnector({
      agent,
      spellRunner,
    })
    agent.upstreet = upstreet
  }

  async function stopUpstreet({ agent }) {
    if (!agent.upstreet)
      return console.warn("Upstreet isn't running, can't stop it")
    try {
      await agent.upstreet.destroy()
      agent.upstreet = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped upstreet client for agent ' + agent.name)
  }

  return {
    start: startUpstreet,
    stop: stopUpstreet,
  }
}

async function handleSpeak({ output, agent, event }) {
  console.log('********* SENT MESSAGE TO UPSTREET', agent.id, output, event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    await agent.upstreet.handleSpeak(resp, event)
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

const UpstreetPlugin = new ServerPlugin({
  name: 'UpstreetPlugin',
  inputTypes: [
    {
      name: 'Upstreet (Speak)',
      sockets: inputSockets,
      defaultResponseOutput: 'Upstreet (Speak)',
    },
  ],
  outputTypes: [
    {
      name: 'Upstreet (Speak)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleSpeak({ output, agent, event })
      },
    },
  ],
  agentMethods: getAgentMethods(),
  secrets: [],
})

export default UpstreetPlugin
