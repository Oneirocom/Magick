import { eventSocket, ClientPlugin } from '@magickml/engine'
import { AgentLoopWindow } from './components/loop.component'

const LoopPlugin = new ClientPlugin({
  name: 'LoopPlugin',
  agentComponents: [AgentLoopWindow],
  inputTypes: [{ name: 'Loop In', trigger: true, socket: eventSocket }],
})

export default LoopPlugin
