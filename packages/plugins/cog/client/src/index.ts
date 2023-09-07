// DOCUMENTED
/**
 * A plugin for interacting with cog's API.
 * @class
 */
import { ClientPlugin } from '@magickml/core'
import shared from '@magickml/plugin-cog-shared'

// Importing shared variables from plugin-cog-shared module
const { secrets, completionProviders } = shared

// Input controls for text completion
const textCompletionControls = []

// Object containing all input controls for different completion types
const inspectorControls = {
  text: textCompletionControls,
  text2image: [],
}

// Creating a new cogPlugin instance
const cogPlugin = new ClientPlugin({
  name: 'cogPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default cogPlugin
