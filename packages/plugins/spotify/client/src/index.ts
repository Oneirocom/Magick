// DOCUMENTED
/**
 * The `ClientPlugin` interface represents a plugin used by the application.
 * @interface
 */
import { ClientPlugin } from '@magickml/core'

/**
 * This is the `Nodes` object from the spotify shared plugin.
 * @typedef {object} Nodes
 */
import { getNodes, secrets } from '@magickml/plugin-spotify-shared'

/**
 * Represents a spotify plugin usable by clients.
 */
const spotifyPlugin = new ClientPlugin({
  name: 'spotifyPlugin',
  nodes: getNodes(),
  secrets,
})

export default spotifyPlugin
