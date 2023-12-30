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
    stream: {
      valueType: 'boolean',
      defaultValue: false,
    },
    seed: {
      valueType: 'number',
      defaultValue: 42,
    },
    stop: {
      valueType: 'string',
      defaultValue: '',
    },
    prompt: {
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

      const model: string = read('model') || 'gemini-pro'
      const prompt: string = read('prompt') || ''
      const temperature: number = read('temperature') || 0.5
      const top_p: number = read('top_p') || 1
      const stream: boolean = read('stream') || false

      const request = {
        model,
        messages: [{ role: 'user', content: prompt }],
        options: {
          temperature,
          top_p,
        },
      }

      if (stream) {
        const stream = await coreLLMService.streamCompletion(request)

        for await (const chunk of stream) {
          write('stream', chunk)
          commit('onStream') // Commit for each chunk
        }
      } else {
        const response = await coreLLMService.completion(request)

        write('response', response)
        write('completion', response.choices[0].message.content)
      }

      // Signal end of process
      commit('done')
    } catch (error) {
      console.error('Error in generateText:', error)
      throw error
    }
  },
})
