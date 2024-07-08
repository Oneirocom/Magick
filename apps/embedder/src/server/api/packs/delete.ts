import { z } from 'zod'
import { embedderDb, Pack } from '@magickml/embedder-db-pg'
import { eq } from 'drizzle-orm'
import { createDeletePackJob } from '@magickml/embedder-queue'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  const deletePackSchema = z.object({
    packId: z.string(),
  })

  const { packId } = await readBody(event).then(body =>
    deletePackSchema.parse(body)
  )

  try {
    const pack = await embedderDb
      .select()
      .from(Pack)
      .where(eq(Pack.id, packId))
      .execute()
      .then(results => results[0])

    if (!pack) {
      throw createError({
        statusCode: 404,
        message: 'Pack not found',
      })
    }

    // Enqueue a deletion job
    await createDeletePackJob(packId)

    return { success: true }
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        message: 'Pack not found',
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
})
