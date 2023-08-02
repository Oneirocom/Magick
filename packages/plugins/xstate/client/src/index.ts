import { ClientPlugin } from '@magickml/core'
import { getNodes } from '@magickml/plugin-xstate-shared'

const XStatePlugin = new ClientPlugin({
  name: 'XStatePlugin',
  nodes: getNodes(),
})

export default XStatePlugin
