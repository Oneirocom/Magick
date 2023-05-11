// DOCUMENTED
/**
 * A plugin for interacting with GoogleAI's API.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-googleai-shared'

// Importing shared variables from plugin-googleai-shared module
const { secrets, completionProviders } = shared

// Input controls for text completion
const textCompletionControls = [
  {
    type: InputControl,
    dataKey: 'temperature',
    name: 'Temperature (0-1.0)',
    icon: 'moon',
    defaultValue: 0.5,
  },
  {
    type: InputControl,
    dataKey: 'top_k',
    name: 'Top K (0-100)',
    icon: 'moon',
    defaultValue: 50,
  },
  {
    type: InputControl,
    dataKey: 'top_p',
    name: 'Top P (0-1.0)',
    icon: 'moon',
    defaultValue: 1,
  },
  ,
  {
    type: InputControl,
    dataKey: 'stopSequences',
    name: 'Stop Sequences (comma separated)',
    icon: 'moon',
    defaultValue: '',
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  text: textCompletionControls,
  chat: textCompletionControls,
  embedding: [],
}

// Creating a new GoogleAIPlugin instance
const GoogleAIPlugin = new ClientPlugin({
  name: 'GoogleAIPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default GoogleAIPlugin
