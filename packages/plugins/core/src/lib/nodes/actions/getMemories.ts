import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { Memory, MemoryStreamService } from '../../services/memoryStreamService'
import { CORE_DEP_KEYS } from '@magickml/shared-services'

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
    types: {
      label: 'Types',
      valueType: 'array',
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
    const types = (read('types') as string[]) || []

    if (type) {
      if (!types.includes(type)) {
        types.push(type)
      }
    }

    const { memories, messages } = await memoryService.getMemories(
      limit,
      filter,
      types
    )
    write('memories', memories)
    write('messages', messages)

    commit('flow')
  },
})
