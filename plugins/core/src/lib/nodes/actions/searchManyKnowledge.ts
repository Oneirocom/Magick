import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { ICoreMemoryService } from '../../services/coreMemoryService/coreMemoryService'
import { CORE_DEP_KEYS } from '../../constants'

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
    const coreMemoryService = getDependency<ICoreMemoryService>(
      CORE_DEP_KEYS.MEMORY_SERVICE
    )

    const response = await coreMemoryService?.searchMany(queries)
    write('knowledge', response)
    commit('flow')
  },
})
