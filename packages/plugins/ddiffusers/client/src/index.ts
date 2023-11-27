// DOCUMENTED
/**
 * A plugin for interacting with ddiffusers's API.
 * @class
 */
import { ClientPlugin } from '@magickml/core'
import shared from '@magickml/plugin-ddiffusers-shared'
import { inspectorControls } from './inspectorControls'

// Importing shared variables from plugin-ddiffusers-shared module
const { secrets, getNodes, completionProviders } = shared

// Creating a new ddiffusersPlugin instance
const ddiffusersPlugin = new ClientPlugin({
  name: 'ddiffusersPlugin',
  secrets,
  nodes: getNodes(),
  completionProviders: completionProviders.map(provider => {
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default ddiffusersPlugin
