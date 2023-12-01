// DOCUMENTED
/**
 * A plugin for interacting with OpenAI's API.
 * @class
 */
import { ClientPlugin, InputControl } from 'shared/core'
import shared from '@magickml/plugin-openai-shared'

// Importing shared variables from plugin-openai-shared module
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
    dataKey: 'max_tokens',
    name: 'Max Tokens',
    icon: 'moon',
    defaultValue: 100,
  },
  {
    type: InputControl,
    dataKey: 'top_p',
    name: 'Top P (0-1.0)',
    icon: 'moon',
    defaultValue: 1,
  },
  {
    type: InputControl,
    dataKey: 'frequency_penalty',
    name: 'Frequency Penalty (0-2.0)',
    icon: 'moon',
    defaultValue: 0.0,
  },
  {
    type: InputControl,
    dataKey: 'presence_penalty',
    name: 'Presence Penalty (0-2.0)',
    icon: 'moon',
    defaultValue: 0,
  },
  {
    type: InputControl,
    dataKey: 'stop',
    name: 'Stop (Comma Separated)',
    icon: 'moon',
    defaultValue: '###',
  },
]

// Input controls for chat completion
const chatCompletionControls = [
  {
    type: InputControl,
    dataKey: 'temperature',
    name: 'Temperature (0-1.0)',
    icon: 'moon',
    defaultValue: 0.5,
  },
  {
    type: InputControl,
    dataKey: 'top_p',
    name: 'Top P (0-1.0)',
    icon: 'moon',
    defaultValue: 1,
  },
  {
    type: InputControl,
    dataKey: 'frequency_penalty',
    name: 'Frequency Penalty (0-2.0)',
    icon: 'moon',
    defaultValue: 0.0,
  },
  {
    type: InputControl,
    dataKey: 'presence_penalty',
    name: 'Presence Penalty (0-2.0)',
    icon: 'moon',
    defaultValue: 0,
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  text: textCompletionControls,
  chat: chatCompletionControls,
  embedding: [],
  typeChat: [],
}

// Creating a new OpenAIPlugin instance
const OpenAIPlugin = new ClientPlugin({
  name: 'OpenAIPlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default OpenAIPlugin
