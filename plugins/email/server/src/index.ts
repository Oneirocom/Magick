import { eventSocket, ServerPlugin, triggerSocket, WorldManager } from '@magickml/core'

// Example serverInfo object
// {
//   "smtp" : {
//     "host" : "smtp.gmail.com",
//     "port" : 465,
//     "auth" : {
//       "user" : "email@gmail.com",
//       "pass" : ""
//     }
//   },
//   "imap" : {
//     "host" : "imap.gmail.com",
//     "port" : 993,
//     "auth" : {
//       "user" : "email@gmail.com",
//       "pass" : ""
//     }
//   }
// }

let EmailConnector = null as any;
// dynamically import { EmailConnector } from './connectors/email' if we are in node.js using esm syntax
if(typeof window === 'undefined') {
  import('./connectors/email').then((module) => {
    EmailConnector = module.EmailConnector
  })
}

type StartEmailArgs = {
  agent: any
  spellRunner: any
  worldManager: WorldManager
}

function getAgentMethods() {
  async function startEmail({
    agent,
    spellRunner,
    worldManager,
  }: StartEmailArgs) {
    const { data } = agent.data
    if(!data) return console.log("No data for this agent")
    if(!data.email_enabled) return console.log("Email is not enabled for this agent")
    const email = new EmailConnector({
      agent,
      spellRunner,
      worldManager,
    })
    agent.email = email
  }

  async function stopEmail({agent}) {
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
    start: startEmail,
    stop: stopEmail,
  }
}

async function handleResponse(
  {
    output,
    agent,
    event
  }
) {
  console.log('********* SENT MESSAGE TO EMAIL', agent.id, output, event)
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
  console.log('********* SENT MESSAGE TO EMAIL', agent.id, output, event)
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

const EmailPlugin = new ServerPlugin({
  name: 'EmailPlugin',
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

export default EmailPlugin
