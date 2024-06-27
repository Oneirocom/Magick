import { resolve } from 'path'
import { defineNitroConfig } from 'nitropack/config'

// https://nitro.unjs.io/config
export default defineNitroConfig({
  srcDir: 'src/server',

  runtimeConfig: {
    redis: {
      url: process.env.EMBEDDER_REDIS_URL,
    },
    pinecone: {
      projectName: process.env.EMBEDDER_PINECONE_PROJECT || 'magickEmbedder',
    },
  },

  experimental: {
    tasks: true,
    database: true,
  },

  typescript: {
    tsConfig: {
      extends: './tsconfig.app.json',
    },
  },

  alias: {
    '@magickml/embedder-auth-plugin': resolve(
      __dirname,
      '../../packages/embedder/auth/plugin/src/index.ts'
    ),
    '@magickml/server-db': resolve(
      __dirname,
      '../../packages/server/db/src/index.ts'
    ),
    '@magickml/embedder-auth-token': resolve(
      __dirname,
      '../../packages/embedder/auth/token/src/index.ts'
    ),
    '@magickml/embedder-client-ts': resolve(
      __dirname,
      '../../packages/embedder/client/ts/src/index.ts'
    ),
    '@magickml/embedder-config': resolve(
      __dirname,
      '../../packages/embedder/config/src/index.ts'
    ),
    '@magickml/embedder-db-pinecone': resolve(
      __dirname,
      '../../packages/embedder/db/pinecone/src/index.ts'
    ),
    '@magickml/embedder-db-pg': resolve(
      __dirname,
      '../../packages/embedder/db/pg/src/index.ts'
    ),
    '@magickml/embedder-queue': resolve(
      __dirname,
      '../../packages/embedder/queue/src/index.ts'
    ),

    '@magickml/embedder-loaders-core': resolve(
      __dirname,
      '../../packages/embedder/loaders/core/src/index.ts'
    ),
    '@magickml/embedder-schemas': resolve(
      __dirname,
      '../../packages/embedder/schema/src/index.ts'
    ),
    '@magickml/embedder-worker': resolve(
      __dirname,
      '../../packages/embedder/worker/src/index.ts'
    ),

    '@magickml/embedder-api-jobs': resolve(
      __dirname,
      '../../packages/embedder/api/jobs/src/index.ts'
    ),
    '@magickml/embedder-api-loaders': resolve(
      __dirname,
      '../../packages/embedder/api/loaders/src/index.ts'
    ),
    '@magickml/embedder-api-packs': resolve(
      __dirname,
      '../../packages/embedder/api/packs/src/index.ts'
    ),
  },
})
