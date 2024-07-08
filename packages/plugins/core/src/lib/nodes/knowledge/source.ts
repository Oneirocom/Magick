import { NodeCategory, makeFlowNodeDefinition } from '@magickml/behave-graph'
import { CORE_DEP_KEYS } from '@magickml/shared-services'
import type { EmbedderClient } from '@magickml/embedder-client-ts'
import { loaderSchemaMap, LoaderType } from '@magickml/embedder-schemas'
import { validatePackId } from './shared'

const makeKnowledgeSourceNode = (type: LoaderType) => {
  const schema = loaderSchemaMap[type]
  // this gets the schema properties without the type. sets all to 'string' since that actually works for now
  // we will need to handle dynamic from z.shape in the future (json loader has array input to pick keys for example)
  const inputs = Object.keys(schema.shape)
    .filter(key => key !== 'type')
    .reduce((acc, key) => {
      acc[key] = 'string'
      return acc
    }, {} as Record<string, any>)

  return makeFlowNodeDefinition({
    typeName: `knowledge/embedder/add${
      type.charAt(0).toUpperCase() + type.slice(1)
    }Source`,
    category: NodeCategory.Action,
    label: `Add ${type.charAt(0).toUpperCase() + type.slice(1)} Source`,
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
      name: 'string',
      description: 'string',
      packId: 'string',
      ...inputs,
    },
    out: {
      flow: 'flow',
      loaderId: 'string',
      status: 'string',
    },
    initialState: undefined,
    triggered: async ({ commit, read, write, configuration, graph }) => {
      const name = read('name') as string
      const description = read('description') as string
      // const config = schema.parse(read)
      // we need to get all other inputs (from ...inputs) for config
      const config = Object.keys(inputs).reduce((acc, key) => {
        if (key === 'type') {
          return acc
        }
        acc[key] = read(key as any)
        return acc
      }, {} as Record<string, any>)

      const packId = validatePackId(read('packId') || configuration.packId)

      const { getDependency } = graph

      const embedder = getDependency<EmbedderClient>(
        CORE_DEP_KEYS.EMBEDDER_CLIENT
      )

      if (!embedder) {
        throw new Error('Embedder client not found')
      }

      try {
        const res = await embedder.addLoader(
          {
            name,
            description,
            type,
            config: {
              ...config,
              type,
            } as any,
          },
          {
            params: {
              id: packId,
            },
          }
        )

        write('status', res.status)
        write('loaderId', res.id)

        commit('flow')
      } catch (error) {
        console.error('Error adding source:', error)
      }
    },
  })
}

const addTextSource = makeKnowledgeSourceNode('text')
const addYoutubeSource = makeKnowledgeSourceNode('youtube')
const addYoutubeChannelSource = makeKnowledgeSourceNode('youtube_channel')
const addYoutubeSearchSource = makeKnowledgeSourceNode('youtube_search')
const addWebSource = makeKnowledgeSourceNode('web')
const addSitemapSource = makeKnowledgeSourceNode('sitemap')
const addPdfSource = makeKnowledgeSourceNode('pdf')
const addDocxSource = makeKnowledgeSourceNode('docx')
const addExcelSource = makeKnowledgeSourceNode('excel')
const addPptSource = makeKnowledgeSourceNode('ppt')

const sourceNodes = [
  addTextSource,
  addYoutubeSource,
  addYoutubeChannelSource,
  addYoutubeSearchSource,
  addWebSource,
  addSitemapSource,
  addPdfSource,
  addDocxSource,
  addExcelSource,
  addPptSource,
]

export { makeKnowledgeSourceNode, sourceNodes }
