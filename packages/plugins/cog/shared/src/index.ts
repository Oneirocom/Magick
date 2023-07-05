// DOCUMENTED
import {
  CompletionProvider,
  PluginSecret,
  stringSocket,
  objectSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'cog API Key',
    key: 'cog_api_key',
    global: true,
    getUrl: 'https://beta.cog.com/account/api-keys',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'text',
    subtype: 'json',
    inputs: [
      {
        socket: 'prompt',
        name: 'Prompt',
        type: stringSocket,
      },
      {
        socket: 'schema',
        name: 'Schema',
        type: objectSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: stringSocket,
      },
    ],
    models: ['dolly-v2-3B'],
  },
]

export default {
  secrets,
  completionProviders,
}
