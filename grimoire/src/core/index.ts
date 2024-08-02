import { defineNovaModule } from 'nova'

export const agentModule = defineNovaModule({
  name: 'grimoire',
  features: {
    agentPlugins: 'agentPlugins',
    nodes: 'nodes',
    schemas: 'schemas',
    tools: 'tools',
    templates: 'templates',
  },
  pluginsDir: './runtime/plugins',
  metaUrl: import.meta.url,
})
