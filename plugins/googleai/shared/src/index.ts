// DOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'GoogleAI API Key',
    key: 'googleai_api_key',
    global: true,
    getUrl: 'https://makersuite.google.com/',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'text',
    subtype: 'chat',
    inputs: [
      {
        socket: 'system',
        name: 'Context',
        type: stringSocket,
      },
      {
        socket: 'examples',
        name: 'Examples',
        type: arraySocket,
      },
      {
        socket: 'conversation',
        name: 'Conversation',
        type: arraySocket,
      },
      {
        socket: 'input',
        name: 'Input',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: stringSocket,
      },
      {
        socket: 'error',
        name: 'Error',
        type: stringSocket,
      },
    ],
    models: ['chat-bison-001'],
  },
]

export default {
  secrets,
  completionProviders,
}
