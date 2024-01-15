import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'

import { ICoreMemoryService } from '../../services/coreMemoryService/coreMemoryService'

export const queryKnowledge = makeFlowNodeDefinition({
  typeName: 'action/knowledge/query',
  category: NodeCategory.Action,
  label: 'Query Knowledge',
  in: {
    flow: 'flow',
    query: 'string',
  },
  out: {
    flow: 'flow',
    knowledge: 'string',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const { getDependency } = graph
    const query = read('query') as string
    const coreMemoryService =
      getDependency<ICoreMemoryService>('coreMemoryService')

    const response = await coreMemoryService?.query(query)
    write('knowledge', response)
    commit('flow')
  },
})
