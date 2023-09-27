// UNDOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  PluginSecret,
  stringSocket,
} from 'shared/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Anthropic API Key',
    key: 'anthropic_api_key',
    global: true,
    getUrl: 'https://www.anthropic.com/earlyaccess',
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
        socket: 'conversation',
        name: 'Conversation ',
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
    models: [
      'claude-1',
      'claude-1-100k',
      'claude-instant-1',
      'claude-instant-1-100k',
      'claude-2',
    ],
  },
]

export default {
  secrets,
  completionProviders,
}
