// DOCUMENTED
/**
 * Class representing a server plugin for gcal functionality
 */
import { ServerPlugin } from '@magickml/core'

/**
 * Nodes that are shared between gcal plugins
 */
import { getNodes } from '@magickml/plugin-gcal-shared'

/**
 * Create a new instance of the GcalPlugin class
 */
const GcalPlugin = new ServerPlugin({
  name: 'GcalPlugin',
  nodes: getNodes(),
  services: [],
})

export default GcalPlugin
