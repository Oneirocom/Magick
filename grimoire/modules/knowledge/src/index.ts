import { defineNovaModule } from '@gtc-nova/kit'
import { knowledgeFeatures, type KnowledgeFeatures } from './features'

export const knowledgeModule = defineNovaModule<KnowledgeFeatures>({
  name: 'embedjs',
  features: knowledgeFeatures,
  featureTypeFunctions: {
    loaders: () => {
      console.log('loaders')
    },
    files: () => {
      console.log('files')
    },
  },
  pluginsDir: './../src/runtime/plugins',
  metaUrl: import.meta.url,
  hooks: [],
})

export type * from './types'
