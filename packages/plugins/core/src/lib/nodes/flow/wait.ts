import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

// const hardStop = 1000

export const wait = makeFlowNodeDefinition({
  typeName: 'flow/wait',
  otherTypeNames: ['flow/wait'],
  category: NodeCategory.Flow,
  label: 'Wait',
  configuration: {},
  in: {
    flow: {
      valueType: 'flow',
    },
    milliseconds: {
      valueType: 'integer',
      defaultValue: 1000,
    },
  },
  out: {
    done: 'flow',
  },
  initialState: {},
  triggered: async ({ read, commit }) => {
    const milliseconds = Number(read('milliseconds')) as number

    await new Promise(resolve => setTimeout(resolve, milliseconds))

    commit('done')
  },
})
