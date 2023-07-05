// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds cog completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/core'
import shared from '@magickml/plugin-cog-shared'
import {
  makeJsonformerCompletion
} from './functions'

/**
 * The secrets used by the cog API
 */
const { secrets } = shared

/**
 * The handlers for each type of cog completion
 */
const completionHandlers = {
  text: {
    json: makeJsonformerCompletion,
  },
}

/**
 * A server plugin for the @magickml/core that adds cog completion functionality
 */
const cogPlugin = new ServerPlugin({
  name: 'cogPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default cogPlugin
