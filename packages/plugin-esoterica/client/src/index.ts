import { ClientPlugin } from '@magickml/engine'
import Nodes from '@magickml/plugin-esoterica-shared'

const EsotericaPlugin = new ClientPlugin({
  name: 'EsotericaPlugin',
  nodes: Nodes,
})

export default EsotericaPlugin
