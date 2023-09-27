import {
  eventSocket,
  ServerPlugin,
  triggerSocket,
  getLogger,
} from 'shared/core'

import { GithubConnector } from './connectors/github'
import { getNodes } from '@magickml/plugin-github-shared'

type StartGithubArgs = {
  agent: any
  spellRunner: any
}

function getAgentMethods() {
  async function startGithub({ agent, spellRunner }: StartGithubArgs) {
    const logger = getLogger()
    const { data } = agent.data
    if (!data) return logger.info('No data for this agent')
    if (!data.github_enabled)
      return logger.info('Github is not enabled for this agent')
    if (!data.github_access_token)
      return logger.info('Github Access Token is not set for this agent')
    logger.info('starting github connect')
    try {
      const github = new GithubConnector({
        agent,
        spellRunner,
      })
      agent.github = github
    } catch (err) {
      logger.error('Error starting github client for agent ' + agent.name)
    }
  }

  async function stopGithub({ agent }) {
    const logger = getLogger()
    if (!agent.github) return logger.info("Github isn't running, can't stop it")
    try {
      await agent.github.destroy()
      agent.github = null
    } catch {
      logger.error('Agent does not exist !')
    }
    logger.info('Stopped github client for agent ' + agent.name)
  }

  return {
    start: startGithub,
    stop: stopGithub,
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
