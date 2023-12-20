import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import {
  CoreLLMService,
  Message,
  CompletionOptions,
} from '../../services/coreLLMService'

export const streamGenerateText = makeFlowNodeDefinition({
  typeName: 'magick/streamGenerateText',
  category: NodeCategory.Action,
  label: 'Stream Generate Text',
  in: {
    flow: 'flow',
    model: 'string',
    messages: 'array',
    options: 'object',
  },
  out: {
    flow: 'flow',
    response: 'string',
    end: 'signal', // Output: signal when the stream is finished
  },
  initialState: undefined,
  triggered: ({ commit, read, write, graph: { getDependency } }) => {
    const streamText = async () => {
      try {
        const coreLLMService = getDependency<CoreLLMService>('coreLLMService')

        if (!coreLLMService) {
          throw new Error('No coreLLMService provided')
        }

        const model: string = read('model') || 'gemini-pro'
        const messages: Message[] = read('messages') || []
        const options: CompletionOptions = read('options') || {}

        // Enable streaming in options
        options.stream = true

        // Call the CoreLLMService's streamCompletion method
        const stream = await coreLLMService.streamCompletion({
          model,
          messages,
          options,
        })

        for await (const chunk of stream) {
          write('response', chunk)
          //TODO: is this right?
          commit('flow') // Commit for each chunk
        }

        // Signal end of stream
        commit('end')
      } catch (error) {
        console.error('Error in streamGenerateText:', error)
        throw error
      }
    }

    void streamText()
  },
})
