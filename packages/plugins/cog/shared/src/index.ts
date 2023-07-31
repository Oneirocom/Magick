// DOCUMENTED
import {
  CompletionProvider,
  PluginSecret,
  stringSocket,
  objectSocket,
  arraySocket,
  numberSocket,
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
  {
    type: 'image',
    subtype: 'text2image',
    inputs: [
      {
        socket: 'prompt',
        name: 'Prompt',
        type: stringSocket,
      },
      {
        socket: 'negative_prompt',
        name: 'Negative Prompt',
        type: stringSocket,
      },
      {
        socket: 'count',
        name: 'Count',
        type: numberSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: arraySocket,
      },
    ],
    models: ['stable-diffusion-2.1'],
  },
]

export default {
  secrets,
  completionProviders,
}
