// Aliased for the sack of proper builds
import { PrismaClient } from './prisma/client-core'

// Aliased for the sack of proper builds
export * from './prisma/client-core'

export type * from './prisma/client-core/index.d.ts'

const globalForPrismaCore = globalThis as { prismaCore?: PrismaClient }

export const prismaCore =
  globalForPrismaCore.prismaCore ||
  new PrismaClient({
    log:
      process.env['NODE_ENV'] === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env['NODE_ENV'] !== 'production')
  globalForPrismaCore.prismaCore = prismaCore
