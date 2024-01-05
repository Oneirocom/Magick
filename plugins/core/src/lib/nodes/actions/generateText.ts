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
    stream: {
      valueType: 'boolean',
      defaultValue: false,
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
        const chunksQueue = [] as any[] // Queue to manage chunks
        let isProcessing = false // Flag to check if a chunk is being processed

        const processNextChunk = () => {
          if (isProcessing) return // If a chunk is being processed, do nothing
          if (chunksQueue.length === 0) {
            commit('done')
            return
          }

          const chunk = chunksQueue.shift() // Get the next chunk
          isProcessing = true
          write('stream', chunk)

          // Now commit the chunk for processing
          commit('onStream', () => {
            // This callback is called when commit is done processing the chunk
            isProcessing = false
            processNextChunk() // Process the next one after current is done
          })
        }

        // Stream and receive chunks
        await coreLLMService.streamCompletion(request, (chunk, text) => {
          chunksQueue.push(text) // Instead of directly writing, queue the text
          processNextChunk() // Try to process next chunk
        })

        // Signifies the end of the streaming
      } else {
        const response = await coreLLMService.completion(request)

        write('response', response)
        write('completion', response.choices[0].message.content)
        // Signal end of process
        commit('done')
      }
    } catch (error) {
      console.error('Error in generateText:', error)
      throw error
    }
  },
})
