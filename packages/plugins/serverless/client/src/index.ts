// DOCUMENTED
/**
 * A plugin for interacting with serverless's API.
 * @class
 */
import { ClientPlugin } from '@magickml/core'
import shared from '@magickml/plugin-serverless-shared'
import { inspectorControls } from './inspectorControls'

// Importing shared variables from plugin-serverless-shared module
const { secrets, getNodes, completionProviders } = shared

// Creating a new serverlessPlugin instance
const serverlessPlugin = new ClientPlugin({
  name: 'serverlessPlugin',
  secrets,
  nodes: getNodes(),
  completionProviders: completionProviders.map(provider => {
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default serverlessPlugin
