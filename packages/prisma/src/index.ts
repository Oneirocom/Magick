import { PrismaClient } from '@prisma/client'
import { DATABASE_URL } from '@magickml/server-config'

<<<<<<< HEAD
=======
console.log('DAtabase URL', DATABASE_URL)

>>>>>>> 6ab5a73908002ae080b1b8f2b94af2437f129ec8
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
})
