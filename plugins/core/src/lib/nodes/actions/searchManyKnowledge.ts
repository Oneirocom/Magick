import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

import { ICoreMemoryService } from '../../services/coreMemoryService/coreMemoryService'

export const searchManyKnowledge = makeFlowNodeDefinition({
  typeName: 'action/knowledge/searchMany ',
  category: NodeCategory.Action,
  label: 'Search Many Knowledge',
  in: {
    flow: 'flow',
    queries: 'array',
  },
  out: {
    flow: 'flow',
    knowledge: 'string',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const { getDependency } = graph
    const queries = read('queries') as string[]
    const coreMemoryService =
      getDependency<ICoreMemoryService>('coreMemoryService')

    const response = await coreMemoryService?.searchMany(queries)
    write('knowledge', response)
    commit('flow')
  },
})
