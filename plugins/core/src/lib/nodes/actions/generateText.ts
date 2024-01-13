import {
  ILogger,
  NodeCategory,
  makeAsyncNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import {
  CompletionResponse,
  LLMModels,
} from '../../services/coreLLMService/types'

export const generateText = makeAsyncNodeDefinition({
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
    response: 'string',
    completionResponse: 'object',
    done: 'flow',
    onStream: 'flow',
    stream: 'string',
    modelUsed: 'string',
  },
  initialState: {
    chunkQueue: [] as any[],
    isProcessing: false,
    fullResponse: '',
    isDone: false,
    completionResponse: null as CompletionResponse | null,
  },
  triggered: async ({
    state,
    finished = () => {},
    commit,
    read,
    write,
    graph: { getDependency },
  }) => {
    try {
      const coreLLMService = getDependency<CoreLLMService>('coreLLMService')

      if (!coreLLMService) {
        throw new Error('No coreLLMService provided')
      }

      const model: LLMModels = read('model') || LLMModels.GPT35Turbo
      const prompt: string = read('prompt') || ''
      const temperature: number = read('temperature') || 0.5
      const top_p: number = read('top_p') || 1
      const maxRetries: number = read('maxRetries') || 1
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

      const processChunk = () => {
        if (state.isProcessing) return

        if (state.chunkQueue.length === 0 && state.isDone) {
          console.log('CHUNK LENGRH IS ZERO>  ENDIONG')
          write('response', state.fullResponse)
          write('completionResponse', state.completionResponse)
          write('modelUsed', model)
          commit('done')
          finished()
          return
        }

        const chunk = state.chunkQueue.shift()

        if (!chunk) {
          console.log('NO CHUNK')
          state.isProcessing = false
          return
        }

        state.isProcessing = true

        if (chunk) {
          state.fullResponse += chunk.choices[0].delta.content || ''
          write('stream', chunk.choices[0].delta.content || '')
        }

        commit('onStream', () => {
          console.log('ON STREAM IN GENERATE TEXT COMMIT')
          state.isProcessing = false
          processChunk()
        })
      }

      coreLLMService.completion({
        request,
        callback: (chunk, isDone, _completionResponse) => {
          console.log('RECEIVED CHUNK', chunk)
          if (isDone) {
            console.log('DONE')
            state.completionResponse = _completionResponse as CompletionResponse
            state.isDone = true
            processChunk()
            return
          }
          if (chunk) state.chunkQueue.push(chunk)
          processChunk()
        },
        maxRetries,
      })

      return state
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
  dispose: () => {
    return {
      chunkQueue: [],
      isDone: false,
      isProcessing: false,
      fullResponse: '',
      completionResponse: null,
    }
  },
})
