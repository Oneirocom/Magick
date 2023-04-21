// UNDOCUMENTED
/**
 * A plugin for the @magickml/core that adds banana.dev completion functionality
 *
 * @remarks
 * The plugin uses handlers for text2image and speech2text which are defined in the 'makeImageCompletion and 'makeSpeechCompletion' functions respectively.',
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-banana-shared'
import { textToAudioCompletion } from './functions'

/**
 * The secrets used by the banana.dev API
 */
const { secrets } = shared

/**
 * The handlers for each type of banan.dev completion
 */
const completionHandlers = {
  audio: {
    text2audio: textToAudioCompletion,
  },
}

const BananaPlugin = new ServerPlugin({
  name: 'BananaPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default BananaPlugin
