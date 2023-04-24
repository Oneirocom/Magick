import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import { GmailAgentWindow } from './components/agent.component'

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

const GmailPlugin = new ClientPlugin({
  name: 'GmailPlugin',
  agentComponents: [GmailAgentWindow],
  inputTypes: [
    { name: 'Gmail', sockets: inputSockets }
  ],
  outputTypes: [
    { name: 'Gmail', sockets: outputSockets }
  ],
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
