import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from 'servicesShared'
import type { EmbedderClient } from '@magickml/embedder/client/ts'
import { validatePackId } from './shared'
import { z } from 'zod'

const QueryResponseSchema = z.object({
  result: z.string(),
  sources: z.array(z.string()),
})

export const queryPack = makeFlowNodeDefinition({
  typeName: 'knowledge/embedder/queryPack',
  category: NodeCategory.Action,
  label: 'Query Knowledge Pack',
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
    result: 'string',
    sources: 'array',
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
      const result = await embedder.queryPack(
        {
          query,
        },
        {
          params: {
            id: packId,
          },
        }
      )

      const parsedResult = QueryResponseSchema.parse(result)

      write('result', parsedResult.result)
      write('sources', parsedResult.sources)

      commit('flow')
    } catch (error) {
      console.error('Error querying pack:', error)
    }
  },
})
