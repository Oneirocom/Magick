// DOCUMENTED
/**
 * Class representing a server plugin for spotify functionality
 */
import { ServerPlugin } from '@magickml/core'

/**
 * Nodes that are shared between spotify plugins
 */
import { getNodes, secrets } from '@magickml/plugin-spotify-shared'

/**
 * Create a new instance of the spotifyPlugin class
 */
const spotifyPlugin = new ServerPlugin({
  name: 'spotifyPlugin',
  nodes: getNodes(),
  secrets,
})

export default spotifyPlugin
