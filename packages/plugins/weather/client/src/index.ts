// DOCUMENTED 
/**
 * A plugin for interacting with weather's API.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-weather-shared'

// Importing shared variables from plugin-weather-shared module
const { secrets, completionProviders } = shared

// Creating a new weatherPlugin instance
const weatherPlugin = new ClientPlugin({
  name: 'weatherPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type 
    return {
      ...provider,
    }
  }),
})

export default weatherPlugin
