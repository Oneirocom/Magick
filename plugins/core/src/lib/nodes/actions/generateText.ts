import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

export const generateText = makeFlowNodeDefinition({
  typeName: 'magick/generateText',
  category: NodeCategory.Action,
  label: 'Generate Text',
  configuration: {
    modelChoices: {
      valueType: 'array',
      defaultValue: Object.values(LLMModels),
    },
  },
  in: {
    flow: 'flow',
    prompt: {
      valueType: 'string',
      defaultValue: '',
    },
    model: {
      valueType: 'string',
      choices: Object.values(LLMModels),
      defaultValue: LLMModels['gemini-pro'],
    },
    maxRetries: {
      valueType: 'number',
      defaultValue: 3,
    },
    temperature: {
      valueType: 'number',
      defaultValue: 0.5,
    },
    top_p: {
      valueType: 'number',
      defaultValue: 1,
    },
    seed: {
      valueType: 'number',
      defaultValue: 42,
    },
    stop: {
      valueType: 'string',
      defaultValue: '',
    },
  },

  out: {
    response: 'object',
    completion: 'string',
    done: 'flow',
    onStream: 'flow',
    stream: 'string',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph: { getDependency } }) => {
    try {
      const coreLLMService = getDependency<CoreLLMService>('coreLLMService')

      if (!coreLLMService) {
        throw new Error('No coreLLMService provided')
      }

      const model: LLMModels = read('model') || LLMModels.GPT35Turbo
      const prompt: string = read('prompt') || ''
      const temperature: number = read('temperature') || 0.5
      const top_p: number = read('top_p') || 1
      const maxRetries: number = read('maxRetries') || 3

      const request = {
        model,
        messages: [{ role: 'user', content: prompt }],
        options: {
          temperature,
          top_p,
        },
      }

      let fullResponse = '' // Variable to accumulate the full response

      // Using the modified completion method
      await coreLLMService.completion({
        request,
        callback: (chunk, isDone) => {
          fullResponse += chunk // Append each chunk to fullResponse
          if (!isDone) {
            // If streaming is not done, handle the chunk
            write('stream', chunk)
            commit('onStream')
          }
        },
        maxRetries,
      })

      // Once streaming is complete, handle the full response
      write('response', fullResponse)
      write('completion', fullResponse) // Assuming fullResponse is the desired completion format
      commit('done') // Signal end of process
    } catch (error: any) {
      const loggerService = getDependency<ILogger>('ILogger')

      if (!loggerService) {
        throw new Error('No loggerService provided')
      }

      loggerService?.log('error', error.toString())
      console.error('Error in generateText:', error)
      throw error
    }
  },
})
