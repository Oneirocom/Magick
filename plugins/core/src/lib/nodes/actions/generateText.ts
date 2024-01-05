import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CoreLLMService, ModelNames } from '../../services/coreLLMService'

export const generateText = makeFlowNodeDefinition({
  typeName: 'magick/generateText',
  category: NodeCategory.Action,
  label: 'Generate Text',
  configuration: {
    modelChoices: {
      valueType: 'array',
      defaultValue: Object.values(ModelNames),
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
      choices: Object.values(ModelNames),
      defaultValue: ModelNames['gemini-pro'],
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

      const model: string = read('model') || 'gpt-3.5-turbo'
      const prompt: string = read('prompt') || ''
      const temperature: number = read('temperature') || 0.5
      const top_p: number = read('top_p') || 1

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
      await coreLLMService.completion(request, (chunk, isDone) => {
        fullResponse += chunk // Append each chunk to fullResponse
        if (!isDone) {
          // If streaming is not done, handle the chunk
          write('stream', chunk)
          commit('onStream')
        }
      })

      // Once streaming is complete, handle the full response
      write('response', fullResponse)
      write('completion', fullResponse) // Assuming fullResponse is the desired completion format
      commit('done') // Signal end of process
    } catch (error) {
      console.error('Error in generateText:', error)
      throw error
    }
  },
})
