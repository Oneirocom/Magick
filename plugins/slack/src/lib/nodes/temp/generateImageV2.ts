import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import LCMCLient from '../../services/lcmClient'

export const generateImageV2 = makeFlowNodeDefinition({
  typeName: 'magick/generateImageV2',
  category: NodeCategory.Action,
  label: 'Generate Image V2',
  configuration: {
    // modelChoices: {
    //   valueType: 'array',
    //   defaultValue: Object.values(ModelNames),
    // },
  },
  in: {
    flow: 'flow',
    prompt: {
      valueType: 'string',
      //   choices: Object.values(ModelNames),
    },
  },

  out: {
    images: 'string[]',
    done: 'flow',
  },
  initialState: undefined,
  triggered: ({ commit, read, write, graph: { getDependency } }) => {
    const generateText = async () => {
      try {
        const lcm = getDependency<LCMCLient>('lcmClient')

        if (!lcm) {
          throw new Error('No LCM Client')
        }

        const prompt = read('prompt') as string

        const res = await lcm.generateImage({
          prompt,
        })

        write('images', res.data.output)

        commit('done')
      } catch (error) {
        console.error('Error in generateImageV2', error)
        throw error
      }
    }

    void generateText()
  },
})
