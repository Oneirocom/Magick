// DOCUMENTED
/**
 * A plugin for the @magickml/core that adds OpenAI completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from 'shared/core'
import shared from '@magickml/plugin-openai-shared'
import {
  makeChatCompletion,
  makeTextCompletion,
  makeTextEmbedding,
  makeTypeChatCompletion,
} from './functions'

/**
 * The secrets used by the OpenAI API
 */
const { secrets } = shared

/**
 * The handlers for each type of OpenAI completion
 */
const completionHandlers = {
  text: {
    text: makeTextCompletion,
    chat: makeChatCompletion,
    embedding: makeTextEmbedding,
    typeChat: makeTypeChatCompletion,
  },
}

/**
 * A server plugin for the @magickml/core that adds OpenAI completion functionality
 */
const OpenAIPlugin = new ServerPlugin({
  name: 'OpenAIPlugin',
  secrets,
  completionProviders: shared.completionProviders.map(provider => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype],
    }
  }),
})

export default OpenAIPlugin
