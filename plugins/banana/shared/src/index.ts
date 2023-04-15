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
    name: 'Banana API Key',
    key: 'banana_api_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
  },
  {
    name: 'Banana Whisper Model Key',
    key: 'banana_whisper_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
  },
  {
    name: 'Banana Docker Diffusers Model Key',
    key: 'banana_ddiffusers_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
  },
  {
    name: 'Banana Carrot Model Key',
    key: 'banana_carrot_key',
    global: true,
    getUrl: 'https://app.banana.dev/',
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
  {
    type: 'image',
    subtype: 'image2text',
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
    models: ['carot'],
  },
  {
    type: 'speech',
    subtype: 'speech2text',
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
    models: ['whisper-large-v2'],
  },
]

export default {
  secrets,
  completionProviders,
}
