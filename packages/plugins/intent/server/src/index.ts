import { ServerPlugin } from 'shared/core'
import { getNodes } from '@magickml/plugin-intent-shared'
import { intent } from './services/intent/intent'

const IntentPlugin = new ServerPlugin({
  name: 'IntentPlugin',
  services: [intent],
  nodes: getNodes(),
})

export default IntentPlugin
