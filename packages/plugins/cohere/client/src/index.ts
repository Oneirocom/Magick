// DOCUMENTED
/**
 * A plugin for interacting with cohere's API.
 * @class
 */
import {
  ClientPlugin,
  DropdownControl,
  InputControl,
  NumberControl,
} from '@magickml/core'
import shared from '@magickml/plugin-cohere-shared'

// Importing shared variables from plugin-cohere-shared module
const { secrets, completionProviders } = shared

// Input controls for text completion
const textCompletionControls = [
  {
    type: NumberControl,
    dataKey: 'max_tokens',
    name: 'Max Tokens',
    icon: 'moon',
    defaultValue: 20,
  },
  {
    type: NumberControl,
    dataKey: 'temperature',
    name: 'Temperature (0-5.0)',
    icon: 'moon',
    defaultValue: 0.75,
  },
  {
    type: NumberControl,
    dataKey: 'k',
    name: 'K (0-5.0)',
    icon: 'moon',
    defaultValue: 0,
  },
  {
    type: NumberControl,
    dataKey: 'p',
    name: 'P (0-1.0)',
    icon: 'moon',
    defaultValue: 0.75,
  },
  {
    type: NumberControl,
    dataKey: 'frequency_penalty',
    name: 'Frequency Penalty (0-1.0)',
    icon: 'moon',
    defaultValue: 0,
  },
  {
    type: NumberControl,
    dataKey: 'presence_penalty',
    name: 'Presence Penalty (0-1.0)',
    icon: 'moon',
    defaultValue: 0,
  },
  {
    type: InputControl,
    dataKey: 'end_sequences',
    name: 'End Sequences (comma separated)',
    icon: 'moon',
    defaultValue: '',
  },
  {
    type: InputControl,
    dataKey: 'stop_sequences',
    name: 'Stop Sequences (comma separated)',
    icon: 'moon',
    defaultValue: '',
  },
  {
    type: DropdownControl,
    dataKey: 'return_likelihoods',
    name: 'Return Likelihoods',
    values: ['NONE', 'GENERATION', 'ALL'],
    icon: 'moon',
    defaultValue: 'NONE',
  },
  {
    type: DropdownControl,
    dataKey: 'truncate',
    name: 'Truncate',
    values: ['NONE', 'START', 'END'],
    icon: 'moon',
    defaultValue: 'END',
  },
]

// Object containing all input controls for different completion types
const inspectorControls = {
  text: textCompletionControls,
}

// Creating a new coherePlugin instance
const coherePlugin = new ClientPlugin({
  name: 'coherePlugin',
  secrets, // API Key and Model ID secrets
  completionProviders: completionProviders.map(provider => {
    // Adding custom input controls for each completion type
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default coherePlugin
