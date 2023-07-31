// UNDOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  embeddingSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Cohere API Key',
    key: 'cohere_api_key',
    global: true,
    getUrl: 'https://beta.cohere.com/account/api-keys',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'text',
    subtype: 'text',
    inputs: [
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
        socket: 'results',
        name: 'Results',
        type: arraySocket,
      },
      {
        socket: 'error',
        name: 'Error',
        type: stringSocket,
      },
    ],
    models: [
      'cohere-command',
      'cohere-command-light',
      'cohere-base',
      'cohere-base-light',
    ],
  },
  {
    type: 'text',
    subtype: 'embedding',
    inputs: [
      {
        socket: 'input',
        name: 'Input',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'embedding',
        name: 'Embedding',
        type: embeddingSocket,
      },
    ],
    models: [
      'embed-english-v2.0',
      'embed-english-light-v2.0',
      'embed-multilingual-v2.0',
    ],
  },
  {
    type: 'text',
    subtype: 'summarize',
    inputs: [
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
    models: ['summarize-medium', 'summarize-xlarge'],
  },
]

export default {
  secrets,
  completionProviders,
}
