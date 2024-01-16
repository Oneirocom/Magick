import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { ICoreMemoryService } from '../../services/coreMemoryService/coreMemoryService'
import { CORE_DEP_KEYS } from '../../constants'

export const searchKnowledge = makeFlowNodeDefinition({
  typeName: 'action/knowledge/search',
  category: NodeCategory.Action,
  label: 'Search Knowledge',
  in: {
    flow: 'flow',
    query: 'string',
  },
  out: {
    flow: 'flow',
    knowledge: 'array',
    data: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const { getDependency } = graph
    const query = read('query') as string
    const coreMemoryService = getDependency<ICoreMemoryService>(
      CORE_DEP_KEYS.MEMORY_SERVICE
    )

    const response = await coreMemoryService?.search(query)
    const knowledge = response.map(([knowledge]) => knowledge)
    write('knowledge', knowledge)
    write('data', response)
    commit('flow')
  },
})
