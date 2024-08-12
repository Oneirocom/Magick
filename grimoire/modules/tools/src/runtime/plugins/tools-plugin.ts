import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { toolRegistry } from '../utils/registry'
import { useRuntimeConfig } from 'nitro/runtime'
import type { ToolFeatures } from '../../features'
import { getVirtualTools } from '../exports'
import type { NitroApp } from 'nitro/types'

export default defineNovaPlugin<ToolFeatures, any, any, any, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const toolOptions = config.tools || {}
    return { toolOptions }
  },
  before: async (nitro, br) => {},
  runtimeSetup: {
    tools: {
      getVirtualHandlers: getVirtualTools,
      initFeatureHandlers: async (nitro, handlers) => {
        for (const handler of handlers) {
          const { name, definition } = (await handler.handler()).default
          toolRegistry.register(name, definition)
        }
      },
    },
  },
  after: (nitro, br) => {
    nitro.toolRegistry = toolRegistry
    console.info(
      'Tool module initialized. Use nitro.toolRegistry to access tools.'
    )
  },
})
