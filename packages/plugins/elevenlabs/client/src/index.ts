// DOCUMENTED
/**
 * A plugin for interacting with elevenlabs's API.
 * @class
 */
import { ClientPlugin, InputControl } from 'shared/core'
import shared from '@magickml/plugin-elevenlabs-shared'

// Importing shared variables from plugin-elevenlabs-shared module
const { secrets, completionProviders } = shared

// Input controls for textToSpeech completion
const textToSpeechControls = [
  {
    type: InputControl,
    dataKey: 'stability',
    name: 'Stability (0-1.0)',
    icon: 'moon',
    defaultValue: 0,
  },
  {
    type: InputControl,
    dataKey: 'similarity_boost',
    name: 'Similarity Boost (0-1.0)',
    icon: 'moon',
    defaultValue: 0,
  },
  {
    type: InputControl,
    dataKey: 'voice_id',
    name: 'Voice ID',
    icon: 'moon',
    defaultValue: '',
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  text2speech: textToSpeechControls,
}

// Creating a new elevenlabsPlugin instance
const elevenlabsPlugin = new ClientPlugin({
  name: 'elevenlabsPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default elevenlabsPlugin
