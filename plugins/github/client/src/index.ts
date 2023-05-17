import {
  ClientPlugin,
  eventSocket,
  triggerSocket,
} from '@magickml/core'
import { GithubAgentWindow } from './components/agent.component'
import Nodes from '@magickml/plugin-github-shared' 


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
  nodes: Nodes,
  agentComponents: [GithubAgentWindow],
  inputTypes: [
    { name: 'Github (Feed)', sockets: inputSockets},
    // { name: 'Github (DM)', trigger: true, socket: eventSocket },
    // { name: 'Github (Mention)', trigger: true, socket: eventSocket },
  ],
  outputTypes: [
    { name: 'Github (Feed)', sockets: outputSockets },
    // { name: 'Github (DM)', trigger: false, socket: eventSocket },
    // { name: 'Github (Mention)', trigger: false, socket: eventSocket },
  ],
  secrets: [
    {
      name: 'Access Token',
      key: 'github_access_token',
      global: false
    }
  ]
})

export default GithubPlugin
