import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import { LLMModels } from '../../services/coreLLMService/types'

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
      valueType: 'integer',
      defaultValue: 3,
    },
    temperature: {
      valueType: 'integer',
      defaultValue: 0.5,
    },
    top_p: {
      valueType: 'integer',
      defaultValue: 1,
    },
    seed: {
      valueType: 'integer',
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
      const stop: string = read('stop') || ''

      const request = {
        model,
        messages: [{ role: 'user', content: prompt }],
        options: {
          temperature,
          top_p,
          stop,
        },
      }

      const chunkQueue = [] as string[]
      let isProcessing = false
      let fullResponse = ''

      const processChunk = () => {
        if (isProcessing) {
          return // Exit if already processing a chunk or if there are no chunks
        }

        if (chunkQueue.length === 0) {
          write('response', fullResponse)
          write('completion', fullResponse) // Assuming fullResponse is the desired completion format
          commit('done') // Signal end of process
          return
        }

        isProcessing = true
        const chunk = chunkQueue.shift() // Get the next chunk from the queue

        // Process the chunk here...
        fullResponse += chunk // Append each chunk to fullResponse
        write('stream', chunk)

        console.log('processing chunk', chunk)
        // Assume commit calls the provided callback once it's done
        commit('onStream', () => {
          // Callback after processing the chunk
          isProcessing = false
          processChunk() // Call processChunk again to process the next chunk
        })
      }

      // Using the modified completion method
      await coreLLMService.completion({
        request,
        callback: (chunk, isDone) => {
          if (isDone) {
            // Handle the end of the stream
            processChunk() // Make sure to process the last chunk
          } else {
            // Add the chunk to the queue and attempt to process it
            console.log('chunk:', chunk)
            chunkQueue.push(chunk)
            processChunk()
          }
        },
        maxRetries,
      })

      // Once streaming is complete, handle the full response
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
