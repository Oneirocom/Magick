import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from '../../config'
import type { EmbedderClient } from '@magickml/embedder/client/ts'
import { validatePackId } from './shared'

export const createPack = makeFlowNodeDefinition({
  typeName: 'knowledge/embedder/createKnowledgePack',
  category: NodeCategory.Action,
  label: 'Create Knowledge Pack',
  in: {
    flow: 'flow',
    name: 'string',
    description: 'string',
  },
  out: {
    flow: 'flow',
    id: 'string',
    name: 'string',
    description: 'string',
    createdAt: 'string',
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

      write('id', pack.id)
      write('name', pack.name)
      write('description', pack.description)
      write('createdAt', pack.createdAt)

      commit('flow')
    } catch (error) {
      // Handle error
      console.error('Error creating pack:', error)
    }
  },
})

export const getManyPacks = makeFlowNodeDefinition({
  typeName: 'knowledge/embedder/getManyPacks',
  category: NodeCategory.Action,
  label: 'Get Many Packs',
  in: {
    flow: 'flow',
  },
  out: {
    flow: 'flow',
    packs: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, write, graph }) => {
    const { getDependency } = graph
    const embedder = getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (!embedder) {
      throw new Error('Embedder client not found')
    }

    try {
      const packs = await embedder.getPacksByEntityAndOwner()

      write('packs', packs)

      commit('flow')
    } catch (error) {
      console.error('Error getting packs:', error)
    }
  },
})

export const getPack = makeFlowNodeDefinition({
  typeName: 'knowledge/embedder/getPack',
  category: NodeCategory.Action,
  label: 'Get Pack',
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
  },
  out: {
    flow: 'flow',
    id: 'string',
    name: 'string',
    description: 'string',
    createdAt: 'string',
    sources: 'array',
  },
  initialState: undefined,
  triggered: async ({ commit, write, configuration, graph }) => {
    const packId = validatePackId(configuration.packId)

    const { getDependency } = graph
    const embedder = getDependency<EmbedderClient>(
      CORE_DEP_KEYS.EMBEDDER_CLIENT
    )

    if (!embedder) {
      throw new Error('Embedder client not found')
    }

    try {
      const pack = await embedder.findPack({
        params: {
          id: packId,
        },
      })

      write('id', pack.id)
      write('name', pack.name)
      write('description', pack.description)
      write('createdAt', pack.createdAt)
      write('sources', pack.loaders)

      commit('flow')
    } catch (error) {
      console.error('Error getting pack:', error)
    }
  },
})
