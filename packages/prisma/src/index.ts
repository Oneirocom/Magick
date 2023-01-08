import { PrismaClient } from '@prisma/client'


// check if process is undefined, if so, we are in a browser, use import.meta instead
const DATABASE_URL = process.env.DATABASE_URL
export const prisma = new PrismaClient(DATABASE_URL ? {
    datasources: {
        db: {
            url: DATABASE_URL,
        } as any,
    },
} : null)
