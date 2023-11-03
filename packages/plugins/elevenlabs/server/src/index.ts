// DOCUMENTED
/**
 * A plugin for the shared/core that adds elevenlabs completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from 'shared/core'
import shared from '@magickml/plugin-elevenlabs-shared'
import { textToSpeech } from './functions'

/**
 * The secrets used by the elevenlabs API
 */
const { secrets } = shared

/**
 * The handlers for each type of elevenlabs completion
 */
const completionHandlers = {
  audio: {
    text2speech: textToSpeech,
  },
}

/**
 * A server plugin for the shared/core that adds elevenlabs completion functionality
 */
const elevenlabsPlugin = new ServerPlugin({
  name: 'elevenlabsPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default elevenlabsPlugin
