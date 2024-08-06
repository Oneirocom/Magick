import { defineNovaPlugin } from '@gtc-nova/kit/runtime'
import { nodeRegistry } from '../utils'
import { useRuntimeConfig } from 'nitro/runtime'
import type { NodeFeatures } from '../../features'
import { getVirtualNodes } from '../exports'

export default defineNovaPlugin<NodeFeatures, any>({
  useRuntimeConfig,
  initialize: (nitro, config) => {
    const nodeOptions = config.nodes || {}
    return { nodeOptions }
  },
  runtimeSetup: {
    nodes: {
      getVirtualHandlers: getVirtualNodes,
      initFeatureHandlers: async (nitro, handlers) => {
        for (const handler of handlers) {
          const nodeDefinition = (await handler.handler()).default
          nodeRegistry.register(nodeDefinition)
        }
      },
    },
  },
  before: (nitro, br) => {},
  after: (nitro, br) => {
    nitro.nodeRegistry = nodeRegistry

    // nitro.router.get('/api/nodes/discovery', defineEventHandler(() => {
    //   const nodes = nodeRegistry.getAll();
    //   return Object.entries(nodes).map(([typeName, definition]) => ({
    //     typeName,
    //     category: definition.category,
    //     label: definition.label,
    //     helpDescription: definition.helpDescription,
    //     configuration: definition.configuration,
    //   }));
    // }));

    // nitro.router.use(router);
  },
})
