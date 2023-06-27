// DOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  embeddingSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'
import { PRODUCTION } from '@magickml/config'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'OpenAI API Key',
    key: 'openai_api_key',
    global: true,
    getUrl: 'https://beta.openai.com/account/api-keys',
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
    ],
    models: [
      'text-davinci-003',
      'text-davinci-002',
      'text-davinci-001',
      'text-curie-001',
      'text-babbage-001',
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
    models: ['text-embedding-ada-002'],
  },
  {
    type: 'text',
    subtype: 'chat',
    inputs: [
      {
        socket: 'system',
        name: 'System Directive',
        type: stringSocket,
      },
      {
        socket: 'conversation',
        name: 'Conversation ',
        type: arraySocket,
      },
      {
        socket: 'input',
        name: 'Input',
        type: stringSocket,
      },
      {
        socket: 'function',
        name: 'Function',
        type: stringSocket,
      }
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
    models: PRODUCTION ? ['gpt-3.5-turbo'] : ['gpt-3.5-turbo', 'gpt4', 'gpt-4-0613'],
  },
]

export default {
  secrets,
  completionProviders,
}
