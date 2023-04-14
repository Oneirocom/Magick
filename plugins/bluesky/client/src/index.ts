import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import { BlueskyAgentWindow } from './components/agent.component'

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

const BlueskyPlugin = new ClientPlugin({
  name: 'BlueskyPlugin',
  agentComponents: [BlueskyAgentWindow],
  inputTypes: [{ name: 'Bluesky (Reply)', sockets: inputSockets }],
  outputTypes: [{ name: 'Bluesky (Reply)', sockets: outputSockets }],
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
