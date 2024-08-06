import { defineNovaModule } from '@gtc-nova/kit'
import { schemaFeatures, type SchemaFeatures } from './features'

export const schemasModule = defineNovaModule<SchemaFeatures>({
  name: 'schemas',
  features: schemaFeatures,
  featureTypeFunctions: {
    schemas: () => {
      console.log('schemas')
    },
  },
  pluginsDir: './../src/runtime/plugins',
  metaUrl: import.meta.url,
  hooks: [],
})

export type * from './types'
