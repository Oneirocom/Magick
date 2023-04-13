// DOCUMENTED
/**
 * A plugin for interacting with Docker Diffusers API.
 * @class
 */
import { ClientPlugin, InputControl } from '@magickml/core'
import shared from '@magickml/plugin-docker-diffusers-shared'

// Importing shared variables from plugin-openai-shared module
const { secrets, completionProviders } = shared

// Input controls for text completion
const imageCompletionControls = [
  {
    type: InputControl,
    dataKey: 'prompt',
    name: 'Prompt',
    icon: 'moon',
    defaultValue: 0.0,
  },
  {
    type: InputControl,
    dataKey: 'nprompt',
    name: 'Negative Prompt',
    icon: 'moon',
    defaultValue: 0.0,
  },
  {
    type: InputControl,
    dataKey: 'width',
    name: 'Width',
    icon: 'moon',
    defaultValue: 0.5,
  },
  {
    type: InputControl,
    dataKey: 'height',
    name: 'Height',
    icon: 'moon',
    defaultValue: 100,
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  text2image: imageCompletionControls,
}

// Creating a new DockerDiffusersPlugin instance
const DockerDiffusersPlugin = new ClientPlugin({
  name: 'DockerDiffusersPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default DockerDiffusersPlugin
