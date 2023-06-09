// DOCUMENTED 
/**
 * A plugin for interacting with OpenAI's API.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-storage-shared'

// Importing shared variables from plugin-openai-shared module
const { secrets, completionProviders } = shared

// Object containing all input controls for different completion types
const inspectorControls = {
  upload: [],
}

// Creating a new OpenAIPlugin instance
const StoragePlugin = new ClientPlugin({
  name: 'StoragePlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type 
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default StoragePlugin