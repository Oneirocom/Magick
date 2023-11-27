// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds ddiffusers AI completion functionality
 *
 * @remarks
 * The plugin uses handlers to make requests to ddiffusers AI providers.
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-ddiffusers-shared'

/**
 * The secrets used by providers
 */
const { secrets, getNodes } = shared

/**
 * A server plugin for providers
 */
const ddiffusersPlugin = new ServerPlugin({
  name: 'ddiffusersPlugin',
  secrets,
  nodes: getNodes(),
})
export default ddiffusersPlugin
