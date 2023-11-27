// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds serverless AI completion functionality
 *
 * @remarks
 * The plugin uses handlers to make requests to serverless AI providers.
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-serverless-shared'

/**
 * The secrets used by providers
 */
const { secrets, getNodes, completionProviders } = shared

/**
 * A server plugin for providers
 */
const serverlessPlugin = new ServerPlugin({
  name: 'serverlessPlugin',
  secrets,
  nodes: getNodes(),
  // completionProviders: shared.completionProviders.map(provider => {
  //   return {
  //     ...provider,
  //     // handler: completionHandlers[provider.type][provider.subtype],
  //   }
  // }),
})
export default serverlessPlugin
