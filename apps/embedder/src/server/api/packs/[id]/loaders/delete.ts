import { z } from 'zod'
import { embedderDb, Loader } from '@magickml/embedder-db-pg'
import { eq } from 'drizzle-orm'
import { createDeleteLoaderJob } from '@magickml/embedder-queue'
import { createError } from 'h3'

export default defineEventHandler(async event => {
  const deleteLoaderSchema = z.object({
    loaderId: z.string(),
    filePath: z.string(),
  })
  const { loaderId, filePath } = await readBody(event).then(body =>
    deleteLoaderSchema.parse(body)
  )

  try {
    const loader = await embedderDb
      .select()
      .from(Loader)
      .where(eq(Loader.id, loaderId))
      .execute()
      .then(results => results[0])

    if (!loader) {
      throw createError({
        statusCode: 404,
        message: 'Loader not found',
      })
    }

    // Enqueue a deletion job
    await createDeleteLoaderJob(loaderId, filePath)

    return { success: true }
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw createError({
        statusCode: 404,
        message: 'Loader not found',
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Internal Server Error',
    })
  }
})
