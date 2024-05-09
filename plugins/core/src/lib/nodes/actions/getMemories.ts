import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { Memory, MemoryStreamService } from '../../services/memoryStreamService'
import { CORE_DEP_KEYS } from '../../config'

export const getMemories = makeFlowNodeDefinition({
  typeName: 'action/memory/getMemories',
  category: NodeCategory.Action,
  label: 'Get Memories',
  in: {
    flow: 'flow',
    limit: {
      label: 'Limit',
      defaultValue: 10,
      valueType: 'integer',
    },
    type: {
      label: 'Type',
      valueType: 'string',
    },
    filter: {
      label: 'Filter',
      valueType: 'object',
    },
  },
  out: {
    flow: 'flow',
    memories: 'array',
    messages: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, read, graph, write }) => {
    const { getDependency } = graph
    const memoryService = getDependency<MemoryStreamService>(
      CORE_DEP_KEYS.MEMORY_STREAM_SERVICE
    )

    if (!memoryService) {
      throw new Error('Memory service not found')
    }

    const filter = read('filter') as Partial<Omit<Memory, 'event'>>
    const limit = Number(read('limit')) as number
    const type = read('type') as string

    if (type) {
      filter.type = type
    }

    const { memories, messages } = await memoryService.getMemories(
      limit,
      filter
    )
    write('memories', memories)
    write('messages', messages)

    commit('flow')
  },
})
