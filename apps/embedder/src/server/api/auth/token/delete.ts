import { embedderDb, ApiKey } from '@magickml/embedder-db-pg'
import { DeleteTokenRequestSchema } from '@magickml/embedder-schemas'
import { eq } from 'drizzle-orm'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const result = DeleteTokenRequestSchema.safeParse(body)
    const { error } = result
    if (error) {
      throw createError({
        status: 400,
        message: `Error deleting token: ${error}`,
      })
    }
    await embedderDb.delete(ApiKey).where(eq(ApiKey.agentId, body.agentId))
  } catch (error) {
    console.error(error)
    throw createError({
      status: 500,
      message: `Error deleting token: ${error}`,
    })
  }
})
