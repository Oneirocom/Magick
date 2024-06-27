import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { Memory, MemoryStreamService } from '../../services/memoryStreamService'
import { CORE_DEP_KEYS } from '@magickml/shared-services'

export const clearMemories = makeFlowNodeDefinition({
  typeName: 'action/memory/clearMemories',
  category: NodeCategory.Action,
  label: 'Clear Memories',
  in: {
    flow: 'flow',
    filter: {
      label: 'Filter',
      defaultValue: {},
      valueType: 'object',
    },
  },
  out: {
    flow: 'flow',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph }) => {
    const { getDependency } = graph
    const memoryService = getDependency<MemoryStreamService>(
      CORE_DEP_KEYS.MEMORY_STREAM_SERVICE
    )

    if (!memoryService) {
      throw new Error('Memory service not found')
    }

    const filter = read('filter') as Partial<Omit<Memory, 'event'>>

    await memoryService.clearMemories(filter)

    commit('flow')
  },
})
