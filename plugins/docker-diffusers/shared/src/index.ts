// DOCUMENTED
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
    name: 'Banana API Key (Docker Diffusers)',
    key: 'docker-diffusers-api-key',
    global: true,
    getUrl: 'https://beta.openai.com/account/api-keys',
  },
  {
    name: 'Banana Model Key (Docker Diffusers)',
    key: 'docker-diffusers-model-key',
    global: true,
    getUrl: 'https://beta.openai.com/account/api-keys',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'image',
    subtype: 'text2image',
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
    models: ['stable-diffusion-1-5'],
  },
]

export default {
  secrets,
  completionProviders,
}
