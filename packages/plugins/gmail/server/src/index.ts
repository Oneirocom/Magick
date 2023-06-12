import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core'

let GmailConnector = null as any
// dynamically import { GmailConnector } from './connectors/gmail' if we are in node.js using esm syntax
if (typeof window === 'undefined') {
  import('./connectors/gmail').then(module => {
    GmailConnector = module.GmailConnector
  })
}

type StartGmailArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startGmail({ agent, spellRunner }: StartGmailArgs) {
    const { data } = agent.data
    if (!data) return console.log('No data for this agent')
    if (!data.gmail_enabled)
      return console.log('Gmail is not enabled for this agent')
    const gmail = new GmailConnector({
      agent,
      spellRunner,
    })
    agent.gmail = gmail
  }

  async function stopGmail({ agent }) {
    if (!agent.gmail) return console.warn("Gmail isn't running, can't stop it")
    try {
      await agent.gmail.destroy()
      agent.gmail = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped gmail client for agent ' + agent.name)
  }

  return {
    start: startGmail,
    stop: stopGmail,
  }
}

async function handleResponse({ output, agent, event }) {
  console.log('********* SENT MESSAGE TO EMAIL', agent.id, output, event)
  console.log('event is', event)
  console.log('event.channel is', event.channel)

  const resp = output
  if (resp && resp !== undefined && resp?.length > 0) {
    await agent.gmail.handleResponse(resp, event)
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

const GmailPlugin = new ServerPlugin({
  name: 'GmailPlugin',
  inputTypes: [
    { name: 'Gmail', sockets: inputSockets, defaultResponseOutput: 'Gmail' },
  ],
  outputTypes: [
    {
      name: 'Gmail',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Gmail Address',
      key: 'gmail_address',
      global: false,
    },
    {
      name: 'Password',
      key: 'gmail_password',
      global: false,
    },
  ],
})

export default GmailPlugin
