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
    count: {
      valueType: 'integer',
      defaultValue: 2,
    },
    metadata: 'object',
  },
  out: {
    flow: 'flow',
    knowledge: 'array',
    data: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const { getDependency } = graph
    const queries = read('queries') as string[]
    const count = Number(read('count')) as number
    const metadata = (read('metadata') as Record<string, any>) || {}
    const coreMemoryService = getDependency<ICoreMemoryService>(
      CORE_DEP_KEYS.MEMORY_SERVICE
    )

    const deduplicateByContext = array => {
      const unique = {}
      array.forEach(item => {
        unique[item.context] = item
      })
      return Object.values(unique)
    }

    const response = await coreMemoryService?.searchMany({
      queries,
      numDocuments: count,
      metadata,
    })

    // Use the function with your response data
    const uniqueResponses = deduplicateByContext(response) as any[]

    const knowledge = uniqueResponses.map(result => result.context)

    write('knowledge', knowledge)
    write('data', response)
    commit('flow')
  },
})
