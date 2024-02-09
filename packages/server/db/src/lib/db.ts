import { PrismaClient } from '@prisma/client-core'

export * from '@prisma/client-core'

const globalForPrismaCore = globalThis as { prisma?: PrismaClient }

export const prismaCore =
globalForPrismaCore.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrismaCore.prisma = prismaCore