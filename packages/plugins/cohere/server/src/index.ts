// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds cohere completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-cohere-shared'
import { makeTextCompletion } from './functions'

/**
 * The secrets used by the cohere API
 */
const { secrets } = shared

/**
 * The handlers for each type of cohere completion
 */
const completionHandlers = {
  text: {
    text: makeTextCompletion,
  },
}

/**
 * A server plugin for the @magickml/core that adds cohere completion functionality
 */
const coherePlugin = new ServerPlugin({
  name: 'coherePlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default coherePlugin
