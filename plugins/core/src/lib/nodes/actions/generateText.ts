import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import { LLMModels, Choice } from '../../services/coreLLMService/types'

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
    completionResponse: 'object',
    done: 'flow',
    onStream: 'flow',
    stream: 'string',
    modelUsed: 'string',
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

      const chunkQueue = [] as Choice[]
      let isProcessing = false
      let fullResponse = ''

      const processChunk = () => {
        if (isProcessing) {
          return
        }

        if (chunkQueue.length === 0) {
          write('response', fullResponse)
          commit('done')
        }
        isProcessing = true
        const chunk = chunkQueue.shift()

        fullResponse += chunk?.message.content || ''
        write('stream', chunk?.message.content || '')
        commit('onStream', () => {
          isProcessing = false
          processChunk()
        })
      }

      await coreLLMService.completion({
        request,
        callback: (chunk, isDone, completionResponse) => {
          if (isDone) {
            write('response', fullResponse)
            write('completionResponse', completionResponse)
            write('modelUsed', model)
            commit('done')
          } else {
            if (chunk) chunkQueue.push(chunk)
            processChunk()
          }
        },
        maxRetries,
      })
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
