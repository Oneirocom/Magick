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
    { name: 'Gmail (Reply)', sockets: inputSockets },
    { name: 'Gmail (Mention)', sockets: inputSockets }
  ],
  outputTypes: [
    { name: 'Gmail (Reply)', sockets: outputSockets },
    { name: 'Gmail (Mention)', sockets: outputSockets },
    { name: 'Gmail (Post)', sockets: outputSockets }
  ],
  secrets: [
    {
      name: 'User ID',
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
