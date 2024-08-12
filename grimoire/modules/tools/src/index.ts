import { defineNovaModule } from '@gtc-nova/kit'
import { toolFeatures, type ToolFeatures } from './features'

export const toolsModule = defineNovaModule<ToolFeatures>({
  name: 'tools',
  features: toolFeatures,
  featureTypeFunctions: {
    tools: () => {
      console.log('tools')
    },
  },
  pluginsDir: './../src/runtime/plugins',
  metaUrl: import.meta.url,
  hooks: [],
})

export type * from './types'
