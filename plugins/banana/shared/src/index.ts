// UNDOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  // embeddingSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Banana API Key',
    key: 'banana_api_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
  },
  {
    name: 'Banana Riffusion Model Key',
    key: 'banana_riffusion_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
  },
  {
    name: 'Riffusion Supabase Bucket Secret',
    key: 'riffusion_supabase_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
  }
  
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */

const completionProviders: CompletionProvider[] = [
  {
    type: 'audio',
    subtype: 'text2audio',
    inputs: [
      {
        socket: 'prompt',
        name: 'Prompt',
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
    models: ['riffusion'],
  },
]

export default {
  secrets,
  completionProviders,
}
