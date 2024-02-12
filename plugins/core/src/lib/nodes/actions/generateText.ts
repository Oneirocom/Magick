import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import { CORE_DEP_KEYS } from '../../constants'
import { IEventStore } from 'server/grimoire'
import {
  CompletionModel,
  GoogleAIStudioModels,
  LLMProviders,
} from 'servicesShared'

export const generateText = makeFlowNodeDefinition({
  typeName: 'magick/generateText',
  category: NodeCategory.Action,
  label: 'Generate Text',
  configuration: {
    modelProviders: {
      valueType: 'array',
      defaultValue: [],
    },
    modelProvider: {
      valueType: 'string',
      defaultValue: LLMProviders.GoogleAIStudio,
    },
    models: {
      valueType: 'array',
      defaultValue: [],
    },
    model: {
      valueType: 'string',
      defaultValue: GoogleAIStudioModels.GeminiPro,
    },
    customBaseUrl: {
      valueType: 'string',
      defaultValue: '',
    },
    hiddenProperties: {
      valueType: 'string',
      defaultValue: [
        'hiddenProperties',
        'modelProvider',
        'model',
        'models',
        'customBaseUrl',
      ],
    },
  },
  in: {
    flow: 'flow',
    prompt: {
      valueType: 'string',
      defaultValue: '',
    },
    modelOverride: {
      valueType: 'string',
      defaultValue: '',
    },
    stop: {
      valueType: 'string',
      defaultValue: '',
    },
    temperature: {
      valueType: 'float',
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
  },
  initialState: undefined,
  triggered: async ({
    commit,
    read,
    write,
    configuration,
    graph: { getDependency },
  }) => {
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
        const coreLLMService = getDependency<CoreLLMService>(
          CORE_DEP_KEYS.LLM_SERVICE
        )
        if (!coreLLMService) {
          throw new Error('No coreLLMService provided')
        }

        const prompt: string = read('prompt') || ''
        const temperature: number = read('temperature') || 0.5
        const top_p: number = read('top_p') || 1
        const maxRetries: number = read('maxRetries') || 1
        const stop: string = read('stop') || ''
        const customBaseUrl: string = configuration.customBaseUrl || ''
        // const modelProvider: LLMProviders = configuration.modelProvider
        const model: CompletionModel =
          read('modelOverride') || configuration.model

        // Check for custom OpenAI and empty base URL
        // if (modelProvider === LLMProviders.CustomOpenAI && !customBaseUrl) {
        //   throw new Error(
        //     'Custom base URL is required for Custom OpenAI provider'
        //   )
        // }

        const request = {
          model,
          messages: [{ role: 'user', content: prompt }],
          options: {
            temperature,
            top_p,
            stop,
            base_url: customBaseUrl || undefined,
          },
        }

        const processNextChunk = async iterator => {
          const result = await iterator.next()
          if (result.done) {
            write('response', result.value.choices[0].message.content || '')
            write('completionResponse', result.value) // Assuming the last value is the completion response
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

        const eventStore = getDependency<IEventStore>('IEventStore')
        const spellId = eventStore?.currentEvent()?.spellId

        // our iterator is a generator function that will yield a chunk of data
        // each time it is called
        const iterator = coreLLMService.completionGenerator({
          request,
          maxRetries,
          spellId,
        })

        // Start the processing loop and pass in the iterator
        processNextChunk(iterator).catch(error => {
          outerReject(error)
        })
      } catch (error: any) {
        const loggerService = getDependency<ILogger>(CORE_DEP_KEYS.LOGGER)
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
