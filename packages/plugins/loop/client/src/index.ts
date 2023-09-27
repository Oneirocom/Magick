// DOCUMENTED
import { eventSocket, ClientPlugin, triggerSocket } from 'shared/core'
import { AgentLoopWindow } from './components/loop.component'

/**
 * The sockets that the `LoopPlugin` accepts as input.
 */
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

/**
 * The `LoopPlugin` class provides loop functionality to the engine.
 */
class LoopPlugin extends ClientPlugin {
  /**
   * Constructs a new instance of the `LoopPlugin` class.
   */
  constructor() {
    super({
      name: 'LoopPlugin',
      agentComponents: [AgentLoopWindow],
      inputTypes: [{ name: 'Loop In', sockets: inputSockets }],
      spellTemplates: [],
    })
  }
}

export default new LoopPlugin()
