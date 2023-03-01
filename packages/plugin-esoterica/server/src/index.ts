import { ServerPlugin } from "@magickml/engine"
import Nodes from '@magickml/plugin-esoterica-shared'

const EsotericaPlugin = new ServerPlugin({
  name: 'EsotericaPlugin',
  nodes: Nodes
})

export default EsotericaPlugin;
