import {
  ILogger,
  NodeCategory,
  makeFlowNodeDefinition,
} from '@magickml/behave-graph'
import { CoreLLMService } from '../../services/coreLLMService/coreLLMService'
import { CORE_DEP_KEYS } from '../../config'
import { IEventStore } from 'server/grimoire'
import { getProviderIdMapping } from 'servicesShared'

type Message = {
  role: string
  content: string
}

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
      defaultValue: 'openai',
    },
    providerApiKeyName: {
      valueType: 'string',
      defaultValue: 'OPENAI_API_KEY',
    },
    models: {
      valueType: 'array',
      defaultValue: [],
    },
    model: {
      valueType: 'string',
      defaultValue: 'gpt-3.5-turbo',
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
        'providerApiKeyName',
      ],
    },
  },
  in: {
    flow: 'flow',
    prompt: {
      valueType: 'string',
      defaultValue: '',
    },
    system: {
      valueType: 'string',
      defaultValue: '',
    },
    messages: {
      valueType: 'array',
      defaultValue: [],
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
    maxTokens: {
      valueType: 'integer',
      defaultValue: 256,
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

        const eventStore = getDependency<IEventStore>('IEventStore')

        if (!coreLLMService) {
          throw new Error('No coreLLMService provided')
        }

        if (!eventStore) {
          throw new Error('No eventStore provided')
        }

        const prompt: string = read('prompt') || ''
        const system: string = read('system') || ''
        const messages: Message[] = read('messages') || []
        const temperature: number = Number(read('temperature')) || 0.5
        const top_p: number = Number(read('top_p')) || 1
        const maxRetries: number = Number(read('maxRetries')) || 1
        const stop: string = read('stop') || ''
        const customBaseUrl: string = configuration.customBaseUrl || ''
        const providerApiKeyName: string =
          configuration.providerApiKeyName || undefined
        const max_tokens: number = Number(read('maxTokens')) || 256
        let modelProvider: string = getProviderIdMapping(
          configuration.modelProvider
        )
        let model: string = read('modelOverride') || configuration.model

        if (modelProvider === 'unsupported') {
          modelProvider = 'openai'
          model = 'gpt-3.5-turbo'
        }

        if (messages[messages.length - 1]?.role === 'user') {
          messages.pop()
        }

        // handle situation where there is no prompt
        if (!prompt) {
          commit('done')
          write('response', '')
          outerResolve(undefined)
          return
        }

        // only add system message if it exists
        const allMessages = [
          ...(system ? [{ role: 'system', content: system }] : []),
          ...messages,
          { role: 'user', content: prompt },
        ] as Message[]

        const stopSequences = stop.split(',').map(s => s.trim())

        const request = {
          model,
          providerApiKeyName,
          messages: allMessages,
          provider: modelProvider,
          options: {
            temperature,
            top_p,
            ...(stop ? { stop: stopSequences } : {}),
            ...(customBaseUrl ? { base_url: customBaseUrl } : {}),
            max_tokens,
          },
        }

        console.log('REQUEST OPTIONS', request.options)

        const processNextChunk = async (iterator: AsyncGenerator<any>) => {
          const result = await iterator.next()
          if (result.done) {
            write(
              'response',
              result.value.choices[0].message.content.trim() || ''
            )
            console.log('result:', result.value.choices[0].message.content)
            write('completionResponse', result.value) // Assuming the last value is the completion response
            // await eventStore.saveAgentMessage(
            //   result.value.choices[0].message.content
            // )
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
