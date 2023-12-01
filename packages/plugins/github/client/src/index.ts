import { ClientPlugin, eventSocket, triggerSocket } from 'shared/core'
import { GithubAgentWindow } from './components/agent.component'
import { getNodes } from '@magickml/plugin-github-shared'

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

const GithubPlugin = new ClientPlugin({
  name: 'GithubPlugin',
  nodes: getNodes(),
  agentComponents: [GithubAgentWindow],
  inputTypes: [
    {
      name: 'Github (Issue)',
      sockets: inputSockets,
      defaultResponseOutput: '',
    },
    {
      name: 'Github (Pull Request)',
      sockets: inputSockets,
      defaultResponseOutput: '',
    },
    {
      name: 'Github (Comment)',
      sockets: inputSockets,
      defaultResponseOutput: '',
    },
  ],
  outputTypes: [
    { name: 'Github (Issue Comment)', sockets: outputSockets },
    { name: 'Github (Pull Request Comment)', sockets: outputSockets },
    { name: 'Github (Comment Reply)', sockets: outputSockets },
  ],
  secrets: [],
})

export default GithubPlugin
