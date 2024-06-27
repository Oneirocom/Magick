import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from '@magickml/shared-services'
import type { EmbedderClient } from '@magickml/embedder-client-ts'
import { validatePackId } from './shared'
import { PackQueryContextSchema } from '@magickml/embedder-schema'

export const getContext = makeFlowNodeDefinition({
  typeName: 'knowledge/embedder/getContext',
  category: NodeCategory.Action,
  label: 'Get Context',
  configuration: {
    hiddenProperties: {
      valueType: 'array',
      defaultValue: ['packId'],
    },
    packId: {
      valueType: 'string',
      defaultValue: '',
    },
  },
  in: {
    flow: 'flow',
    query: 'string',
    packId: 'string',
  },
  out: {
    flow: 'flow',
    context: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, configuration, graph }) => {
    const query = read('query') as string
    const packId = validatePackId(read('packId') || configuration.packId)

    const { getDependency } = graph
    const embedder = getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (!embedder) {
      throw new Error('Embedder client not found')
    }

    try {
      const result = await embedder.getContext(
        {
          query,
        },
        {
          params: { id: packId },
        }
      )

      const parsedResult = PackQueryContextSchema.parse(result)

      write('context', parsedResult)

      commit('flow')
    } catch (error) {
      console.error('Error getting context:', error)
    }
  },
})
