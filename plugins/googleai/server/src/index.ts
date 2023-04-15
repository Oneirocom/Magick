// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds GoogleAI completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-googleai-shared'
import {
  makeChatCompletion,
} from './functions'

/**
 * The secrets used by the GoogleAI API
 */
const { secrets } = shared

/**
 * The handlers for each type of GoogleAI completion
 */
const completionHandlers = {
  text: {
    chat: makeChatCompletion,
  },
}

/**
 * A server plugin for the @magickml/core that adds GoogleAI completion functionality
 */
const GoogleAIPlugin = new ServerPlugin({
  name: 'GoogleAIPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default GoogleAIPlugin
