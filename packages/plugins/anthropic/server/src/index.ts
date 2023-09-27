// UNDOCUMENTED
/**
 * A plugin for the @magickml/core that adds anthropic completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from 'shared/core'
import shared from '@magickml/plugin-anthropic-shared'
import { makeChatCompletion } from './functions'

/**
 * The secrets used by the anthropic API
 */
const { secrets } = shared

/**
 * The handlers for each type of anthropic completion
 */
const completionHandlers = {
  text: {
    chat: makeChatCompletion,
  },
}

/**
 * A server plugin for the @magickml/core that adds anthropic completion functionality
 */
const anthropicPlugin = new ServerPlugin({
  name: 'anthropicPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default anthropicPlugin
