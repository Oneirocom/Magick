import {
  ClientPlugin,
  eventSocket,
  triggerSocket,
} from '@magickml/core'
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
  }
]

const outputSockets = [
  {
    socket: 'output',
    name: 'output',
    type: eventSocket,
  }
]

const GithubPlugin = new ClientPlugin({
  name: 'GithubPlugin',
  nodes: getNodes(),
  agentComponents: [GithubAgentWindow],
  inputTypes: [
    { name: 'Github (New Issues)', sockets: inputSockets, defaultResponseOutput: '' },
    { name: 'Github (New PRs)', sockets: inputSockets, defaultResponseOutput: '' },
    { name: 'Github (Issue Response)', sockets: inputSockets, defaultResponseOutput: '' },
  ],
  outputTypes: [
    { name: 'Github (New Issues)', sockets: outputSockets, }
  ],
  secrets: [
    {
      name: 'Github Access Token',
      key: 'github_access_token',
      global: true
    }
  ]
})

export default GithubPlugin
