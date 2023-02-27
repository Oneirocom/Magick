import { ClientPlugin } from "@magickml/engine"
import { AgentLoopWindow } from "./components/loop.component"

const LoopPlugin = new ClientPlugin({
  name: 'LoopPlugin', 
  nodes: [], 
  agentComponents: [AgentLoopWindow],
  inputTypes: ['Loop In'],
  outputTypes: ['Loop Out'],
})

export default LoopPlugin;