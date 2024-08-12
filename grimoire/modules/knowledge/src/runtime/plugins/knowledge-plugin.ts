import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { useRuntimeConfig } from 'nitro/runtime'
import type { KnowledgeFeatures } from '../../features'
import { initKnowledgeRuntime } from '../utils/knowledge'
import { getVirtualLoaders } from '../exports'

export default defineNovaPlugin<KnowledgeFeatures, any, any, any, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const knowledgeOptions = config.embedjs || {}
    return { knowledgeOptions }
  },
  before: initKnowledgeRuntime,
  runtimeSetup: {
    loaders: {
      getVirtualHandlers: getVirtualLoaders,
      initFeatureHandlers: async (n, handlers) => {
        // TOOD: once the definer is ready
        // for (const handler of handlers) {
        //   const loader = (await handler.handler()).default
        //   n.knowledge.ragApp.addLoader(loader)
        // }
      },
    },
    files: {
      getVirtualHandlers: () => [],
      initFeatureHandlers: async (n, handlers) => {},
    },
  },
  after: async (nitro, br) => {
    await nitro.knowledge.ragApp.build()
  },
})
