import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from '../../config'
import type { EmbedderClient } from '@magickml/embedder/client/ts'
import { LoaderTypeSchema } from '@magickml/embedder/schema'

export const createPack = makeFlowNodeDefinition({
  typeName: 'action/knowledge/createKnowledgePack',
  category: NodeCategory.Action,
  label: 'Create Knowledge Pack',
  in: {
    flow: 'flow',
    name: 'string',
    description: 'string',
  },
  out: {
    flow: 'flow',
    pack: 'object',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const name = read('name') as string
    const description = read('description') as string

    const { getDependency } = graph
    const embedder = getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (!embedder) {
      throw new Error('Embedder client not found')
    }

    try {
      const pack = await embedder.createPack({
        name,
        description,
      })

      write('pack', pack)
      commit('flow')
    } catch (error) {
      // Handle error
      console.error('Error creating pack:', error)
    }
  },
})

export const addSource = makeFlowNodeDefinition({
  typeName: 'action/knowledge/addSource',
  category: NodeCategory.Action,
  label: 'Create Pack',
  in: {
    flow: 'flow',
    name: 'string',
    description: 'string',
    type: {
      label: 'Type',
      choices: LoaderTypeSchema.options,
      defaultValue: LoaderTypeSchema.options[0],
      valueType: 'string',
    },
  },
  out: {
    flow: 'flow',
    success: 'boolean',
  },
  initialState: undefined,
  triggered: async ({ commit, read, write, graph }) => {
    const name = read('name')
    const description = read('description')
    const type = read('type')

    const { getDependency } = graph

    const embedder = getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (!embedder) {
      throw new Error('Embedder client not found')
    }

    try {
      await embedder.addLoader(
        {
          name,
          description,
          type,
          config: {
            type: 'object',
          },
        } as any, // this client validates inputu
        {
          params: {
            id: 'packId', // EMBEDDER_TODO: we want to get pack id
          },
        }
      )

      // EMBEDDER_TODO: we want to return job id

      write('success', true)
      commit('flow')
    } catch (error) {
      // Handle error
      console.error('Error creating pack:', error)
    }
  },
})

// export const knowledgeNodes = [createPack, addSource]
