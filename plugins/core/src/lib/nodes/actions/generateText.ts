import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import {
  CompletionResponse,
  LLMModels,
} from '../../services/coreLLMService/types'
import { CORE_DEP_KEYS } from '../../constants'

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
    onStream: 'flow',
    stream: 'string',
    modelUsed: 'string',
  },
  initialState: undefined,
  triggered: async ({
    state,
    commit,
    read,
    write,
    graph: { getDependency },
  }) => {
    const chunkQueue = [] as any[]
    let done = false
    let fullResponse = ''
    let isProcessing = false
    let completionResponse = null as CompletionResponse | null

    /**
     * This promise wrapper is super important. If we await the whole LLM
     * completion, it will block continued fiber execution, which will prevent
     * the onStream callback from being called more than once.  This is because
     * the LLMServer will only send one chunk at a time, and will wait for the
     * previous chunk to be processed before sending the next one.  By wrapping
     * the completion in a promise, we can await the promise, but the promise
     * will resolve immediately, allowing the onStream callback to be called
     * multiple times.  We resolve the promise after commiting the first stream
     * event to the fiber
     */
    return new Promise((resolve, reject) => {
      try {
        const coreLLMService = getDependency<CoreLLMService>(
          CORE_DEP_KEYS.LLM_SERVICE
        )
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

        /**
         * This is the main loop of processing chunks.  It will process a chunk
         * and then call itself recursively until the chunk queue is empty and
         * the isDone flag is set.  Since the work done after calling onStream
         * could take an unknown amount of time, we need to make sure we are
         * separating the incoming stream from the processing. We accumulate the
         * chunks in the chunkQueue, and then process them one at a time. This is
         * why we loop inside the commit callback
         */
        const processChunk = () => {
          // If we are processing a chunk, return and don't process
          if (isProcessing) return

          // We break the loop if the queue is empty and we are done streaming
          if (chunkQueue.length === 0 && done) {
            write('response', fullResponse)
            write('completionResponse', completionResponse)
            write('modelUsed', model)
            commit('done')
            return
          }

          // grab the next available chunk
          const chunk = chunkQueue.shift()

          // Important that is chunk is undefined, we keep processing the queue
          if (!chunk) {
            processChunk()
          }

          // set processing flag to true so we don't process another chunk
          isProcessing = true

          // Write the content out to the stream socket
          if (chunk) write('stream', chunk.choices[0].delta.content || '')

          // Here we commit the next chunk to the fiber to be processed.
          // When the whole chain is done, we resolve with the callback.
          commit('onStream', () => {
            // set processsing flag to false so the next call of processChunk
            // goes through
            isProcessing = false

            // Loop process chunk to keep processing chunks from the queue
            processChunk()
          })
        }

        /**
         * Important that we DON'T await this in full because it blocks execution
         * of the built of commit fiber until the whole completion comes in,
         * defeating the point of streaming.
         */
        coreLLMService.completion({
          request,
          callback: (chunk, isDone, _completionResponse) => {
            // if streaming, add the chunk to the queue
            chunkQueue.push(chunk)

            // Check for done state
            if (isDone) {
              completionResponse = _completionResponse
              fullResponse = _completionResponse!.choices[0].message.content
              done = true

              // If we arent streaming, we can just resolve here
              if (!stream) {
                write('response', fullResponse)
                write('completionResponse', completionResponse)
                write('modelUsed', model)
                commit('done')
                resolve(undefined)
              }
            }
            if (stream) {
              // Kick off the main loop of processing
              processChunk()

              /**
               * Super important that we resolve the promise wrapper AFTER we commit
               * the first flow to the fiber.  This will cause the engine to keep
               * processing the fiber queue while the messages are still streaming in,
               * causing them to be processed by the processChunk loop.
               */

              resolve(undefined)
            }
          },
          maxRetries,
        })
      } catch (error: any) {
        const loggerService = getDependency<ILogger>(CORE_DEP_KEYS.LOGGER)
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
