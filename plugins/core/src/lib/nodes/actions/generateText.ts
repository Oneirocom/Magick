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
  triggered: async ({ commit, read, write, graph: { getDependency } }) => {
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
    return new Promise((outerResolve, outerReject) => {
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

        const processNextChunk = async iterator => {
          const result = await iterator.next()
          if (result.done) {
            write('response', result.value.choices[0].message.content || '')
            write('completionResponse', result.value) // Assuming the last value is the completion response
            write('modelUsed', model)
            commit('done')
          } else {
            const chunk = result.value
            write('stream', chunk.choices[0].delta.content || '')

            // Commit the 'onStream' event and call the processing function recursively for the next chunk
            commit('onStream', async () => {
              await processNextChunk(iterator)
            })
          }

          // We resolve and move the engine on after we process out first chunk
          outerResolve(undefined)
        }

        // our iterator is a generator function that will yield a chunk of data
        // each time it is called
        const iterator = coreLLMService.completionGenerator({
          request,
          maxRetries,
        })

        // Start the processing loop and pass in the iterator
        processNextChunk(iterator).catch(error => {
          throw new Error(error)
        })
      } catch (error: any) {
        const loggerService = getDependency<ILogger>('ILogger')
        if (!loggerService) {
          throw new Error('No loggerService provided')
        }
        loggerService?.log('error', error.toString())
        console.error('Error in generateText:', error)
        outerReject(error)
      }
    })
  },
})
