import { ClientPlugin, InputControl } from '@magickml/engine'
import shared from '@magickml/plugin-openai-shared'

const { secrets, completionProviders } = shared

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
  }
]

const inspectorControls = {
  text: textCompletionControls,
  chat: chatCompletionControls,
  embedding: [],
}

const OpenAIPlugin = new ClientPlugin({
  name: 'OpenAIPlugin',
  secrets,
  completionProviders: completionProviders.map(provider => {
    return {
      ...provider,
      inspectorControls: inspectorControls[provider.subtype],
    }
  }),
})

export default OpenAIPlugin
