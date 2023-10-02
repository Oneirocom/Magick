// DOCUMENTED
/**
 * A plugin for interacting with OpenAI's API.
 * @class
 */
import { ClientPlugin, InputControl, SliderControl } from '@magickml/core'
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
    type: SliderControl,
    dataKey: 'temperature',
    name: 'Temperature (0-1.0)',
    icon: 'moon',
    defaultValue: 0.5,
    min: 0,
    max: 1.0,
    step: 0.01,
    tooltip:
      'Controls randomness: lowering results in less random completions. As the temperature approaches zero, the model will become deterministicand repetitive.',
  },
  {
    type: SliderControl,
    dataKey: 'top_p',
    name: 'Top P (0-1.0)',
    icon: 'moon',
    defaultValue: 1,
    min: 0,
    max: 1.0,
    step: 0.01,
    tooltip:
      'Controls the proportion of the mass of the distribution for the next token: smaller values make the output more focused and deterministic.',
  },
  {
    type: SliderControl,
    dataKey: 'frequency_penalty',
    name: 'Frequency Penalty (0-2.0)',
    icon: 'moon',
    defaultValue: 0.0,
    min: 0,
    max: 2.0,
    step: 0.01,
    tooltip:
      'Subtracts from the likelihood of each token based on its frequency: higher values make frequent tokens less likely to appear.',
  },
  {
    type: SliderControl,
    dataKey: 'presence_penalty',
    name: 'Presence Penalty (0-2.0)',
    icon: 'moon',
    defaultValue: 0,
    min: 0,
    max: 2.0,
    step: 0.01,
    tooltip:
      'Adds to the likelihood of each token based on its frequency: higher values make frequent tokens more likely to appear.',
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
