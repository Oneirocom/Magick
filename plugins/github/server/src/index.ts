import { eventSocket, ServerPlugin, triggerSocket } from '@magickml/core'

import { GithubConnector } from './connectors/github'
import { getNodes } from '@magickml/plugin-github-shared'

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

  await agent.github.handleMessage(event, output)
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
  nodes: getNodes(),
  inputTypes: [
    {
      name: 'Github (Issue)',
      sockets: inputSockets,
      defaultResponseOutput: 'Github (Issue Comment)',
    },
    {
      name: 'Github (Pull Request)',
      sockets: inputSockets,
      defaultResponseOutput: 'Github (Pull Request Comment)',
    },
    {
      name: 'Github (Comment)',
      sockets: inputSockets,
      defaultResponseOutput: 'Github (Comment Reply)',
    },
  ],
  outputTypes: [
    {
      name: 'Github (Issue Comment)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await agent.github.handleMessage(event, output, 'issue')
      },
    },
    {
      name: 'Github (Pull Request Comment)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await agent.github.handleMessage(event, output, 'pull_request')
      },
    },
    {
      name: 'Github (Comment Reply)',
      sockets: outputSockets,
      handler: async ({ output, agent, event }) => {
        await agent.github.handleMessage(event, output, 'comment')
      },
    },
  ],
  agentMethods: getAgentMethods(),
  secrets: [
    {
      name: 'Access Token',
      key: 'github_access_token',
      global: true,
    },
  ],
})

export default GithubPlugin
