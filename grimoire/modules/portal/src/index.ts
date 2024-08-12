import { defineNovaModule } from '@gtc-nova/kit'

export const portalModule = defineNovaModule<Record<string, any>>({
  name: 'portal',
  features: [],
  featureTypeFunctions: {
    portal: () => {
      console.log('portal sync')
    },
  },
  pluginsDir: './../src/runtime/plugins',
  metaUrl: import.meta.url,
  hooks: [],
})

export type * from './types'
