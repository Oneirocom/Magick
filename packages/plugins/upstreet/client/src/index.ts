import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import { UpstreetAgentWindow } from './components/agent.component'

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

const UpstreetPlugin = new ClientPlugin({
  name: 'UpstreetPlugin',
  agentComponents: [UpstreetAgentWindow],
  inputTypes: [
    { name: 'Upstreet (Speak)', sockets: inputSockets},
    // { name: 'Upstreet (Action)', sockets: inputSockets },
    // { name: 'Upstreet (World Event)', sockets: inputSockets },
    // { name: 'Upstreet (Player Connected)', sockets: inputSockets },
    // { name: 'Upstreet (Player Disconnected)', sockets: inputSockets }
  ],
  outputTypes: [
    { name: 'Upstreet (Speak)', sockets: outputSockets },
    // { name: 'Upstreet (Emote)', sockets: outputSockets },
    // { name: 'Upstreet (Emotion)', sockets: outputSockets },
    // Goto
    // LookAt
    // Wear
    // Unwear
    // Pick Up
    // Drop
  ],
  secrets: [],
})

export default UpstreetPlugin
