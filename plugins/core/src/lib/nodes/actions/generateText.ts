import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import {
  CoreLLMService,
  Message,
  CompletionOptions,
} from '../../services/coreLLMService'

export const generateText = makeFlowNodeDefinition({
  typeName: 'magick/generateText',
  category: NodeCategory.Action,
  label: 'Generate Text',
  in: {
    flow: 'flow',
    model: 'string',
    messages: 'array',
    options: 'object', // Includes the useStreaming flag
  },
  out: {
    response: 'object',
    completion: 'string',
    done: 'flow', // Output: signal when the process is finished
    onStream: 'flow', // Output: signal when a chunk is received (only for streaming)
    stream: 'string', // Streamed data (only for streaming)
  },
  initialState: undefined,
  triggered: ({ commit, read, write, graph: { getDependency } }) => {
    const generateText = async () => {
      try {
        const coreLLMService = getDependency<CoreLLMService>('coreLLMService')

        if (!coreLLMService) {
          throw new Error('No coreLLMService provided')
        }

        const model: string = read('model') || 'gemini-pro'
        const messages: Message[] = read('messages') || []
        const options: CompletionOptions = read('options') || {}

        if (options?.stream) {
          options.stream = true
          const stream = await coreLLMService.streamCompletion({
            model,
            messages,
            options,
          })

          for await (const chunk of stream) {
            write('stream', chunk)
            commit('onStream') // Commit for each chunk
          }
        } else {
          const response = await coreLLMService.completion({
            model,
            messages,
            options,
          })

          write('response', response)
        }

        // Signal end of process
        commit('done')
      } catch (error) {
        console.error('Error in generateText:', error)
        throw error
      }
    }

    void generateText()
  },
})
