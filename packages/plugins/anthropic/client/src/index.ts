// DOCUMENTED
/**
 * A plugin for interacting with anthropic's API.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-anthropic-shared'

// Importing shared variables from plugin-anthropic-shared module
const { secrets, completionProviders } = shared

// Input controls for text completion
const chatCompletionControls = [
  {
    type: InputControl,
    dataKey: 'max_tokens_to_sample',
    name: 'Max tokens to sample',
    icon: 'moon',
    defaultValue: 300,
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  chat: chatCompletionControls,
}

// Creating a new anthropicPlugin instance
const anthropicPlugin = new ClientPlugin({
  name: 'anthropicPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default anthropicPlugin
