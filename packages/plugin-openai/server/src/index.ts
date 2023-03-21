import { ServerPlugin } from '@magickml/engine'
import shared from '@magickml/plugin-openai-shared'
import { makeTextCompletion } from './functions/makeTextCompletion'
import { makeChatCompletion } from './functions/makeChatCompletion'
import { makeTextEmbedding } from './functions/makeTextEmbedding'

const {secrets, completionProviders} = shared

const completionHandlers = {
  text: {
    text: makeTextCompletion,
    chat: makeChatCompletion,
    embedding: makeTextEmbedding
  }
}

const OpenAIPlugin = new ServerPlugin({
  name: 'OpenAIPlugin',
  secrets,
  // for each completion provider, add the handler
  completionProviders: completionProviders.map((provider) => {
    return {
      ...provider,
      handler: completionHandlers[provider.type][provider.subtype]
    }
  })
})

export default OpenAIPlugin
