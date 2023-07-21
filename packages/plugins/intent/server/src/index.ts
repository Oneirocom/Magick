import { ServerPlugin } from '@magickml/core'
import { getNodes } from '@magickml/plugin-intent-shared'

const IntentPlugin = new ServerPlugin({
  name: 'IntentPlugin',
  nodes: getNodes(),
})

export default IntentPlugin
