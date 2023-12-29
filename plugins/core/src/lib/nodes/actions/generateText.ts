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
  triggered: ({ commit, read, write, graph: { getDependency } }) => {
    console.log('HELLO!!!!!')
    const generateText = async () => {
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

        console.log('PROMPT:', prompt)

        if (stream) {
          const stream = await coreLLMService.streamCompletion({
            model,
            messages: [{ role: 'prompt', content: prompt }],
            options: {
              temperature,
              top_p,
            },
          })

          for await (const chunk of stream) {
            write('stream', chunk)
            commit('onStream') // Commit for each chunk
          }
        } else {
          const response = await coreLLMService.completion({
            model,
            messages: [{ role: 'prompt', content: prompt }],
            options: {
              temperature,
              top_p,
            },
          })

          write('response', response)
        }

        // Signal end of process
        commit('done')
      } catch (error) {
        console.error('Error in generateText:', error)
        throw error
      }
    }
    console.log('IRAN')
    void generateText()
  },
})
