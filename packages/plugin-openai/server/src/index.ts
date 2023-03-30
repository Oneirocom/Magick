// GENERATED
/**
 * A plugin for the @magickml/engine that adds OpenAI completion functionality
 *
 * @remarks
 * The plugin uses handlers for text, chat and text embedding which are defined in the 'makeTextCompletion',
 * 'makeChatCompletion' and 'makeTextEmbedding' functions respectively.
 *
 * @packageDocumentation
 */

import { ServerPlugin } from '@magickml/engine'
import shared from '@magickml/plugin-openai-shared'
import {
  makeChatCompletion,
  makeTextCompletion,
  makeTextEmbedding,
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
  },
}

/**
 * A server plugin for the @magickml/engine that adds OpenAI completion functionality
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
