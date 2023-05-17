import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core'

import { GithubConnector } from './connectors/github'

type StartGithubArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startGithub({ agent, spellRunner }: StartGithubArgs) {
    const { data } = agent.data
    if (!data) return console.log('No data for this agent')
    if (!data.github_enabled)
      return console.log('Github is not enabled for this agent')
    if (!data.github_access_token)
      return console.log('Github Access Token is not set for this agent')
    console.log('starting github connect')
    try {
      const github = new GithubConnector({
        ...data,
        agent,
        spellRunner,
      })
      agent.github = github
    } catch (err) {
      console.error('Error starting github client for agent ' + agent.name)
    }
  }

  async function stopGithub({ agent }) {
    if (!agent.github)
      return console.warn("Github isn't running, can't stop it")
    try {
      await agent.github.destroy()
      agent.github = null
    } catch {
      console.log('Agent does not exist !')
    }
    console.log('Stopped github client for agent ' + agent.name)
  }

  return {
    start: startGithub,
    stop: stopGithub,
  }
}

async function handleResponse({ output, agent, event }) {
  if (!output || output === '')
    return console.warn('No output to send to github')
  await agent.github.sendMessageToChannel(event.channel, output)
  console.log('RESPONSE HANDLED')
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

const GithubPlugin = new ServerPlugin({
  name: 'GithubPlugin',
  inputTypes: [
    {
      name: 'Github (Feed)',
      sockets: inputSockets,
      defaultResponseOutput: 'Github (Feed)',
    },
    // { name: 'Github (DM)', trigger: true, socket: eventSocket, defaultResponseOutput: 'Github (DM)' },
    // { name: 'Github (Mention', trigger: true, socket: eventSocket, defaultResponseOutput: 'Github (Mention'}
  ],
  outputTypes: [
    {
      name: 'Github (Feed)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await handleResponse({ output, agent, event })
      },
    },
    // { name: 'Github (DM)', trigger: true, socket: eventSocket, handler: async ({
    //   output, agent, event
    // }) => {
    //   await handleResponse({output, agent, event})
    // }},
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Access Token',
      key: 'github_access_token',
      global: false,
    },
  ],
})

export default GithubPlugin
