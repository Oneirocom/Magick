import { PrismaClient } from '@prisma/client'
import { DATABASE_URL } from '@magickml/server-config'

console.log('DAtabase URL', DATABASE_URL)

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
})
