import { eventSocket, ClientPlugin, triggerSocket } from '@magickml/engine'
import { AgentLoopWindow } from './components/loop.component'

// TODO: Change these to be full inputs
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

const LoopPlugin = new ClientPlugin({
  name: 'LoopPlugin',
  agentComponents: [AgentLoopWindow],
  inputTypes: [{ name: 'Loop In', sockets: inputSockets }],
})

export default LoopPlugin
