import { ClientPlugin, eventSocket, triggerSocket } from '@magickml/core'
import { getNodes } from '@magickml/plugin-intent-shared'

const IntentPlugin = new ClientPlugin({
  name: 'IntentPlugin',
  nodes: getNodes(),
})

export default IntentPlugin
