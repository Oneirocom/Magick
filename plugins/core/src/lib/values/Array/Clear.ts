import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

export const arrayClear = makeFlowNodeDefinition({
  typeName: 'action/array/clear',
  category: NodeCategory.Action,
  label: 'Clear',
  in: {
    flow: 'flow',
    array: 'array',
  },
  out: {
    flow: 'flow',
    array: 'array',
  },
  initialState: undefined,
  triggered: ({ commit, read, write, configuration }) => {
    const array = []
    write('array', array)
    commit('flow')
  },
})
