// DOCUMENTED
import { CompletionProvider, PluginSecret, stringSocket } from 'shared/core'

/**
 * An array of PluginSecret objects containing information about API key secrets.
 */
const secrets: PluginSecret[] = [
  {
    name: 'ElevenLabs API Key',
    key: 'elevenlabs_api_key',
    global: true,
    getUrl: 'https://beta.elevenlabs.io/',
  },
]

/**
 * An array of CompletionProvider objects containing information about supported completion providers.
 */
const completionProviders: CompletionProvider[] = [
  {
    type: 'audio',
    subtype: 'text2speech',
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
    models: ['elevenlabs'],
  },
]

export default {
  secrets,
  completionProviders,
}
