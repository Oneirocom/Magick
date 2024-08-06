import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { schemaRegistry } from '../utils/registry'
import { useRuntimeConfig } from 'nitro/runtime'
import type { SchemaFeatures } from '../../features'
import { getVirtualSchemas } from '../exports'
import type { SchemaRegistry } from '../../types'
import type { NitroApp } from 'nitro/types'

declare module 'nitro/types' {
  interface NitroApp {
    schemaRegistry: SchemaRegistry
  }
}

export default defineNovaPlugin<SchemaFeatures, any, any, any, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const schemaOptions = config.schemas || {}
    return { schemaOptions }
  },
  before: async (nitro, br) => {},
  runtimeSetup: {
    schemas: {
      getVirtualHandlers: getVirtualSchemas,
      initFeatureHandlers: async (nitro, handlers) => {
        for (const handler of handlers) {
          const { key, definition } = (await handler.handler()).default
          schemaRegistry.register(key, definition)
        }
      },
    },
  },
  after: (nitro, br) => {
    nitro.schemaRegistry = schemaRegistry.getAll()
    console.info(
      'Schema module initialized. Use nitro.schemaRegistry to access schemas.'
    )
  },
})
