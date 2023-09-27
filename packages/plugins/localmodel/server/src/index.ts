// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds LocalModel completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from 'shared/core'
import shared from '@magickml/plugin-localmodel-shared'
import {
  makeChatCompletion,
  makeTextCompletion,
  makeTextEmbedding,
} from './functions'

/**
 * The secrets used by the local model handler
 */
const { secrets } = shared

/**
 * The handlers for each type of local completion
 */
const completionHandlers = {
  text: {
    text: makeTextCompletion,
    chat: makeChatCompletion,
    embedding: makeTextEmbedding,
  },
}

/**
 * A server plugin for the @magickml/core that adds local completion functionality
 */
const LocalModelPlugin = new ServerPlugin({
  name: 'LocalModelPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default LocalModelPlugin
