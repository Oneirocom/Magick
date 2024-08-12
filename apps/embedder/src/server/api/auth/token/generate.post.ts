import { generateToken } from '@magickml/embedder-auth-token'
import { ApiKey, embedderDb } from '@magickml/embedder-db-pg'
import { GenerateTokenRequestSchema } from '@magickml/embedder-schemas'
import { randomUUID } from 'crypto'
import { eq } from 'drizzle-orm'

import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const parsedBody = GenerateTokenRequestSchema.safeParse(body)
    if (!parsedBody.success) {
      throw createError({
        status: 400,
        message: 'Invalid request body',
      })
    }

    const { agentId, noExpiresAt, owner, entity } = parsedBody.data

    const activeToken = await embedderDb.query.ApiKey.findFirst({
      where: eq(ApiKey.agentId, agentId),
    })

    if (activeToken) {
      await embedderDb.delete(ApiKey).where(eq(ApiKey.agentId, agentId))
    }

    const token = generateToken({ noExpiresAt, owner, entity })

    if (!token) {
      throw createError({
        status: 500,
        message: 'Error generating token',
      })
    }

    await embedderDb.insert(ApiKey).values({
      id: randomUUID(),
      agentId,
      key: token,
    })

    return { token }
  } catch (error) {
    console.error(error)
    throw createError({
      status: 500,
      message: `Error generating token: ${error}`,
    })
  }
})
