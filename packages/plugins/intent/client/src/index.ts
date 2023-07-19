import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import { getNodes } from '@magickml/plugin-intent-shared'

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

const IntentPlugin = new ClientPlugin({
  name: 'IntentPlugin',
  nodes: getNodes(),
})

export default IntentPlugin
