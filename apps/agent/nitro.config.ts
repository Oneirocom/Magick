import { resolve } from 'path'
import AgentModule from './modules/agent-module'

export default defineNitroConfig({
  srcDir: 'agent',
  //   compatibilityDate: '2024-06-17', // for v3 we will need this
  modules: [AgentModule],

  runtimeConfig: {
    agentId: '123',
  },

  typescript: {
    tsConfig: {
      extends: './tsconfig.app.json',
    },
  },

  alias: {
    '@magickml/agent': resolve(__dirname, '../../apps/agent/src/index.ts'),
    '@magickml/client': resolve(__dirname, '../../apps/client/src/index.ts'),
    '@magickml/client-types': resolve(
      __dirname,
      '../../packages/client/client-types/src/index.ts'
    ),
    '@magickml/client-ui': resolve(
      __dirname,
      '../../packages/client/ui/src/index.ts'
    ),
    '@magickml/docs': resolve(__dirname, '../../apps/docs/src/index.ts'),
    '@magickml/embedder-client-react': resolve(
      __dirname,
      '../../packages/embedder/client/react/src/index.ts'
    ),
    '@magickml/embedder/api/jobs': resolve(
      __dirname,
      '../../packages/embedder/api/jobs/src/index.ts'
    ),
    '@magickml/embedder/api/loaders': resolve(
      __dirname,
      '../../packages/embedder/api/loaders/src/index.ts'
    ),
    '@magickml/embedder/api/packs': resolve(
      __dirname,
      '../../packages/embedder/api/packs/src/index.ts'
    ),
    '@magickml/embedder/auth/plugin': resolve(
      __dirname,
      '../../packages/embedder/auth/plugin/src/index.ts'
    ),
    '@magickml/embedder/auth/token': resolve(
      __dirname,
      '../../packages/embedder/auth/token/src/index.ts'
    ),
    '@magickml/embedder/client/ts': resolve(
      __dirname,
      '../../packages/embedder/client/ts/src/index.ts'
    ),
    '@magickml/embedder/config': resolve(
      __dirname,
      '../../packages/embedder/config/src/index.ts'
    ),
    '@magickml/embedder/db/pinecone': resolve(
      __dirname,
      '../../packages/embedder/db/pinecone/src/index.ts'
    ),
    '@magickml/embedder/db/prisma': resolve(
      __dirname,
      '../../packages/embedder/db/prisma/src/index.ts'
    ),
    '@magickml/embedder/db/sql': resolve(
      __dirname,
      '../../packages/embedder/db/sql/src/index.ts'
    ),
    '@magickml/embedder/db/sql/generated/*': resolve(
      __dirname,
      '../../packages/embedder/db/sql/src/lib/prisma/client-embedder/*'
    ),
    '@magickml/embedder/loaders/core': resolve(
      __dirname,
      '../../packages/embedder/loaders/core/src/index.ts'
    ),
    '@magickml/embedder/queue': resolve(
      __dirname,
      '../../packages/embedder/queue/src/index.ts'
    ),
    '@magickml/embedder/schema': resolve(
      __dirname,
      '../../packages/embedder/schema/src/index.ts'
    ),
    '@magickml/embedder/worker': resolve(
      __dirname,
      '../../packages/embedder/worker/src/index.ts'
    ),
    '@magickml/feathersRedux': resolve(
      __dirname,
      '../../packages/client/feathers-redux-toolkit/src/index.ts'
    ),
    '@magickml/flow-core': resolve(
      __dirname,
      '../../packages/client/flow/core/src/index.ts'
    ),
    '@magickml/icons': resolve(
      __dirname,
      '../../packages/client/icons/src/index.ts'
    ),
    '@magickml/keywords': resolve(
      __dirname,
      '../../packages/cloud/next/keywords/src/index.ts'
    ),
    '@magickml/pages-agents': resolve(
      __dirname,
      '../../portal/cloud/next/pages/agents/src/index.ts'
    ),
    '@magickml/pages-agents/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/agents/src/server.ts'
    ),
    '@magickml/pages-billing': resolve(
      __dirname,
      '../../portal/cloud/next/pages/billing/src/index.ts'
    ),
    '@magickml/pages-billing/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/billing/src/server.ts'
    ),
    '@magickml/pages-editor': resolve(
      __dirname,
      '../../portal/cloud/next/pages/editor/src/index.ts'
    ),
    '@magickml/pages-editor/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/editor/src/server.ts'
    ),
    '@magickml/pages-legal': resolve(
      __dirname,
      '../../portal/cloud/next/pages/legal/src/index.ts'
    ),
    '@magickml/pages-legal/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/legal/src/server.ts'
    ),
    '@magickml/pages-shared': resolve(
      __dirname,
      '../../portal/cloud/next/pages/shared/src/index.ts'
    ),
    '@magickml/pages-subscribe': resolve(
      __dirname,
      '../../portal/cloud/next/pages/subscribe/src/index.ts'
    ),
    '@magickml/pages-subscribe/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/subscribe/src/server.ts'
    ),
    '@magickml/pages-template': resolve(
      __dirname,
      '../../portal/cloud/next/pages/template/src/index.ts'
    ),
    '@magickml/pages-template/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/template/src/server.ts'
    ),
    '@magickml/pages-templates': resolve(
      __dirname,
      '../../portal/cloud/next/pages/templates/src/index.ts'
    ),
    '@magickml/pages-templates/server': resolve(
      __dirname,
      '../../portal/cloud/next/pages/templates/src/server.ts'
    ),
    '@magickml/portal-api': resolve(
      __dirname,
      '../../portal/cloud/packages/api/src/index.ts'
    ),
    '@magickml/portal-auth': resolve(
      __dirname,
      '../../portal/cloud/packages/auth/src/index.ts'
    ),
    '@magickml/portal-billing': resolve(
      __dirname,
      '../../portal/cloud/packages/billing/src/index.ts'
    ),
    '@magickml/portal-config': resolve(
      __dirname,
      '../../portal/cloud/packages/config/src/index.ts'
    ),
    '@magickml/portal-db': resolve(
      __dirname,
      '../../portal/cloud/packages/db/src/index.ts'
    ),
    '@magickml/portal-hooks': resolve(
      __dirname,
      '../../portal/cloud/packages/hooks/src/index.ts'
    ),
    '@magickml/portal-layout-next': resolve(
      __dirname,
      '../../portal/cloud/next/layout/src/index.ts'
    ),
    '@magickml/portal-layout-next/server': resolve(
      __dirname,
      '../../portal/cloud/next/layout/src/server.ts'
    ),
    '@magickml/portal-providers': resolve(
      __dirname,
      '../../portal/cloud/packages/providers/src/index.ts'
    ),
    '@magickml/portal-server-core': resolve(
      __dirname,
      '../../portal/cloud/next/server/core/src/index.ts'
    ),
    '@magickml/portal-server-provider': resolve(
      __dirname,
      '../../portal/cloud/next/server/provider/src/index.ts'
    ),
    '@magickml/portal-server-provider/server': resolve(
      __dirname,
      '../../portal/cloud/packages/server/provider/src/server.ts'
    ),
    '@magickml/portal-server-router': resolve(
      __dirname,
      '../../portal/cloud/next/server/router/src/index.ts'
    ),
    '@magickml/portal-state': resolve(
      __dirname,
      '../../portal/cloud/packages/state/src/index.ts'
    ),
    '@magickml/portal-templates': resolve(
      __dirname,
      '../../portal/cloud/packages/templates/src/index.ts'
    ),
    '@magickml/portal-types': resolve(
      __dirname,
      '../../portal/cloud/packages/types/src/index.ts'
    ),
    '@magickml/portal-ui': resolve(
      __dirname,
      '../../portal/cloud/packages/ui/src/index.ts'
    ),
    '@magickml/portal-utils-server': resolve(
      __dirname,
      '../../portal/cloud/packages/utils/server/src/index.ts'
    ),
    '@magickml/portal-utils-shared': resolve(
      __dirname,
      '../../portal/cloud/packages/utils/shared/src/index.ts'
    ),
    '@magickml/prose': resolve(
      __dirname,
      '../../portal/cloud/next/prose/src/index.ts'
    ),
    '@magickml/prose/server': resolve(
      __dirname,
      '../../portal/cloud/next/prose/src/server.ts'
    ),
    '@magickml/providers': resolve(
      __dirname,
      '../../packages/client/providers/src/index.ts'
    ),
    '@magickml/seraph': resolve(
      __dirname,
      '../../packages/server/seraph/src/index.ts'
    ),
    '@magickml/seraph-manager': resolve(
      __dirname,
      '../../packages/server/seraphManager/src/index.ts'
    ),
    '@magickml/server': resolve(__dirname, '../../apps/server/src/index.ts'),
    '@magickml/server-db': resolve(
      __dirname,
      '../../packages/server/db/src/index.ts'
    ),
    '@magickml/types': resolve(__dirname, '../../packages/@types/src/index.ts'),
    '@magickml/vercel-sdk-core': resolve(
      __dirname,
      '../../packages/server/vercel/core/src/index.ts'
    ),
    '@magickml/zode': resolve(__dirname, '../../packages/zode/src/index.ts'),
    '@magickml/zodekit': resolve(__dirname, '../../nx/zodekit/src/index.ts'),
    '@packmvp': resolve(__dirname, '../../../anne/server/client/sdk.ts'),
    'chat-window': resolve(
      __dirname,
      '../../packages/client/chat/src/index.ts'
    ),
    'client/core': resolve(
      __dirname,
      '../../packages/client/core/src/index.ts'
    ),
    'client/editor': resolve(
      __dirname,
      '../../packages/client/editor/src/index.ts'
    ),
    'client/feathers-client': resolve(
      __dirname,
      '../../packages/client/feathers-client/src/index.ts'
    ),
    'client/layouts': resolve(
      __dirname,
      '../../packages/client/layouts/src/index.ts'
    ),
    'client/state': resolve(
      __dirname,
      '../../packages/client/state/src/index.ts'
    ),
    clientConfig: resolve(
      __dirname,
      '../../packages/client/config/src/index.ts'
    ),
    communication: resolve(
      __dirname,
      '../../packages/shared/communication/src/index.ts'
    ),
    'embedder-db-pg': resolve(
      __dirname,
      '../../packages/embedder/db/pg/src/index.ts'
    ),
    hailmary: resolve(
      __dirname,
      '../../portal/cloud/packages/hailmary/src/index.ts'
    ),
    'hailmary/server': resolve(
      __dirname,
      '../../portal/cloud/packages/hailmary/src/server.ts'
    ),
    ideClient: resolve(
      __dirname,
      '../../portal/cloud/packages/ideClient/src/index.ts'
    ),
    'plugin-state': resolve(
      __dirname,
      '../../packages/server/plugin-state/src/index.ts'
    ),
    'plugin/core': resolve(__dirname, '../../plugins/core/src/index.ts'),
    'plugins/shared': resolve(__dirname, '../../plugins/shared/src/index.ts'),
    '../../portal-client': resolve(
      __dirname,
      '../../packages/server/portal-client/src/index.ts'
    ),
    'server-storage': resolve(
      __dirname,
      '../../packages/server/storage/src/index.ts'
    ),
    'server/agents': resolve(
      __dirname,
      '../../packages/server/agents/src/index.ts'
    ),
    'server/cloud-agent-manager': resolve(
      __dirname,
      '../../packages/server/cloud-agent-manager/src/index.ts'
    ),
    'server/cloud-agent-worker': resolve(
      __dirname,
      '../../packages/server/cloud-agent-worker/src/index.ts'
    ),
    'server/command-hub': resolve(
      __dirname,
      '../../packages/server/command-hub/src/index.ts'
    ),
    'server/communication': resolve(
      __dirname,
      '../../packages/server/communication/src/index.ts'
    ),
    'server/core': resolve(
      __dirname,
      '../../packages/server/core/src/index.ts'
    ),
    'server/credentials': resolve(
      __dirname,
      '../../packages/server/credentials/src/index.ts'
    ),
    'server/event-tracker': resolve(
      __dirname,
      '../../packages/server/event-tracker/src/index.ts'
    ),
    'server/grimoire': resolve(
      __dirname,
      '../../packages/server/grimoire/src/index.ts'
    ),
    'server/logger': resolve(
      __dirname,
      '../../packages/server/logger/src/index.ts'
    ),
    'server/plugin': resolve(
      __dirname,
      '../../packages/server/plugin/src/index.ts'
    ),
    'server/pluginManager': resolve(
      __dirname,
      '../../packages/server/pluginManager/src/index.ts'
    ),
    'server/redis-pubsub': resolve(
      __dirname,
      '../../packages/server/redis-pubsub/src/index.ts'
    ),
    'server/schemas': resolve(
      __dirname,
      '../../packages/server/schemas/src/index.ts'
    ),
    servicesShared: resolve(
      __dirname,
      '../../packages/shared/servicesShared/src/index.ts'
    ),
    'shared/config': resolve(
      __dirname,
      '../../packages/shared/config/src/index.ts'
    ),
    'shared/core': resolve(
      __dirname,
      '../../packages/shared/core/src/index.ts'
    ),
    'shared/nodeSpec': resolve(
      __dirname,
      '../../packages/shared/nodeSpec/src/index.ts'
    ),
    'shared/rete': resolve(
      __dirname,
      '../../packages/shared/rete/src/index.ts'
    ),
    'shared/utils': resolve(
      __dirname,
      '../../packages/shared/utils/src/index.ts'
    ),
    stylesheets: resolve(
      __dirname,
      '../../packages/client/stylesheets/src/index.ts'
    ),
    'token-validation': resolve(
      __dirname,
      '../../packages/server/token-validation/src/index.ts'
    ),
    'window-agent-channels': resolve(
      __dirname,
      '../../packages/client/windows/agentChannels/src/index.ts'
    ),
    'window-knowledge': resolve(
      __dirname,
      '../../packages/client/windows/knowledge/src/index.ts'
    ),
    'windows-events': resolve(
      __dirname,
      '../../packages/client/windows/events/src/index.ts'
    ),
    'windows-shared': resolve(
      __dirname,
      '../../packages/client/windows/shared/src/index.ts'
    ),
    'windows/config': resolve(
      __dirname,
      '../../packages/client/windows/config/src/index.ts'
    ),
    'windows/secrets': resolve(
      __dirname,
      '../../packages/client/windows/secrets/src/index.ts'
    ),
    plugins: resolve(__dirname, '../../plugins/index.ts'),
  },
})
