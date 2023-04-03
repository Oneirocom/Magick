// DOCUMENTED 
/**
 * A class representing a Typescript Server Plugin for MagickML.
 * @public
 */
import { ServerPlugin } from "@magickml/core"
// This import is used to bring in shared 'Nodes' used by the EsotericaPlugin
import Nodes from '@magickml/plugin-esoterica-shared'

// Create a new instance of the ServerPlugin with the name 'EsotericaPlugin' and the shared nodes
const EsotericaPlugin = new ServerPlugin({
  name: 'EsotericaPlugin',
  nodes: Nodes
})

// Export the created instance of the EsotericaPlugin to be used
export default EsotericaPlugin;