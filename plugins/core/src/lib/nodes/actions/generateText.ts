import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import {
  CompletionOptions,
  CoreLLMService,
  Message,
} from '../../services/coreLLMService'

export const generateText = makeFlowNodeDefinition({
  typeName: 'magick/generateText',
  category: NodeCategory.Action,
  label: 'Generate Text',
  in: {
    flow: 'flow',
    model: 'string',
    messages: 'array',
    options: 'object',
  },
  out: {
    flow: 'flow',
    response: 'string',
  },
  initialState: undefined,
  triggered: ({ commit, read, write, graph: { getDependency } }) => {
    const generateText = async () => {
      try {
        const coreLLMService = getDependency<CoreLLMService>('coreLLMService')

        if (!coreLLMService) {
          throw new Error('No coreLLMService provided')
        }

        const model: string = read('model') || 'gemini-pro'
        const messages: Message[] = read('messages') || []
        const options: CompletionOptions = read('options') || {}

        // Call the CoreLLMService's completion method
        const response = await coreLLMService.completion({
          model,
          messages,
          options,
        })

        if (!response) {
          throw new Error('No response from CoreLLMService')
        }

        console.log('RESPONSE:', response)

        write('response', response)
        commit('flow')
      } catch (error) {
        console.error('Error generating text:', error)
        throw error
      }
    }

    void generateText()
  },
})
