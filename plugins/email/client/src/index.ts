import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import { EmailAgentWindow } from './components/agent.component'

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

const EmailPlugin = new ClientPlugin({
  name: 'EmailPlugin',
  agentComponents: [EmailAgentWindow],
  inputTypes: [
    { name: 'Email (Reply)', sockets: inputSockets },
    { name: 'Email (Mention)', sockets: inputSockets }
  ],
  outputTypes: [
    { name: 'Email (Reply)', sockets: outputSockets },
    { name: 'Email (Mention)', sockets: outputSockets },
    { name: 'Email (Post)', sockets: outputSockets }
  ],
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
