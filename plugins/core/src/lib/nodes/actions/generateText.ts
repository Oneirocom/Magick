import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import {
  Chunk,
  CompletionResponse,
  LLMModels,
} from '../../services/coreLLMService/types'

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
    stop: {
      valueType: 'string',
      defaultValue: '',
    },
    temperature: {
      valueType: 'integer',
      defaultValue: 0.5,
    },
    maxRetries: {
      valueType: 'integer',
      defaultValue: 3,
    },
    top_p: {
      valueType: 'integer',
      defaultValue: 1,
    },
    seed: {
      valueType: 'integer',
      defaultValue: 42,
    },
    stream: {
      valueType: 'boolean',
      defaultValue: false,
    },
  },

  out: {
    response: 'string',
    completionResponse: 'object',
    done: 'flow',
    start: 'flow',
    onStream: 'flow',
    stream: 'string',
    modelUsed: 'string',
  },
  initialState: {
    started: false,
    chunkQueue: [] as any[],
    isProcessing: false,
    fullResponse: '',
    isDone: false,
    completionResponse: null as CompletionResponse | null,
  },
  triggered: async ({
    state,
    commit,
    read,
    write,
    graph: { getDependency },
  }) => {
    const resetState = state => {
      state.started = false
      state.chunkQueue = []
      state.isProcessing = false
      state.fullResponse = ''
      state.isDone = false
      state.completionResponse = null
    }

    resetState(state)

    return new Promise((resolve, reject) => {
      try {
        const coreLLMService = getDependency<CoreLLMService>('coreLLMService')

        if (!coreLLMService) {
          throw new Error('No coreLLMService provided')
        }

        const stream: boolean = read('stream') || false
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
          console.log('CHECKING PROCESSING', state.isProcessing)
          if (state.isProcessing) return
          console.log('PROCESSING CHUNK')

          if (
            state.chunkQueue.length === 0 ||
            !state.chunkQueue[state.chunkQueue.length - 1]
          ) {
            console.log('NO CHUNKS LEFT')
            write('response', state.fullResponse)
            write('completionResponse', state.completionResponse)
            write('modelUsed', model)
            commit('done')
            resetState(state)
            state.isProcessing = false
            return
          }

          const chunk = state.chunkQueue.shift() as Chunk

          if (!chunk) {
            state.isProcessing = false
            return
          }

          state.isProcessing = true

          if (chunk) {
            console.log('writing chunk', chunk)
            write('stream', chunk.choices[0].delta.content || '')
          }

          console.log('COMMITTING ON STREAM')
          commit('onStream', () => {
            console.log('COMMIT CALLBACK')
            state.isProcessing = false
            processChunk()
          })
        }

        coreLLMService.completion({
          request,
          callback: (chunk, isDone, _completionResponse) => {
            if (isDone) {
              debugger
              state.completionResponse = _completionResponse
              state.fullResponse =
                _completionResponse!.choices[0].message.content
              state.isDone = true

              if (!stream) {
                write('response', state.fullResponse)
                write('completionResponse', state.completionResponse)
                write('modelUsed', model)
                commit('done')
                resetState(state)
                resolve(state)
              }

              return
            }

            if (stream) {
              state.chunkQueue.push(chunk)

              if (state.started) {
                processChunk()
                state.started = true
                resolve(state)
              }
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
        reject(error)
      }

      return state
    })
  },
})
