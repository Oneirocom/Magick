import { defineNovaModule } from 'nova'

export const agentModule = defineNovaModule({
  name: 'grimoire',
  features: {
    nodes: 'nodes',
  },
  pluginsDir: './runtime/plugins',
  metaUrl: import.meta.url,
})
