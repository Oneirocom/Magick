// DOCUMENTED
import {
  arraySocket,
  CompletionProvider,
  embeddingSocket,
  objectSocket,
  PluginSecret,
  stringSocket,
} from '@magickml/core'

export const GPT4_MODELS = ['gpt-4', 'gpt-4-0613']

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'Weather API Key',
    key: 'weather_api_key',
    global: true,
    getUrl: 'https://beta.weather.com/account/api-keys',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'weather',
    subtype: 'current',
    inputs: [
      {
        socket: 'city',
        name: 'City',
        type: stringSocket,
      },
      {
        socket: 'state',
        name: 'State',
        type: stringSocket,
      },
      {
        socket: 'country',
        name: 'Country',
        type: stringSocket,
      },
    ],
    outputs: [
      {
        socket: 'result',
        name: 'Result',
        type: objectSocket,
      },
    ],
    models: ['fakemodel'],
  },
]

export default {
  completionProviders,
  secrets,
}
