import { z } from 'zod'
import { embedderDb, Loader } from 'embedder-db-pg'
import { eq } from 'drizzle-orm'
import { useBullMQ } from '@magickml/embedder/queue'

export default defineEventHandler(async event => {
  const packId = z.string().parse(event.context.params?.id)
  const loaderId = z.string().parse(event.context.params?.loaderId)

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

  await embedderDb.delete(Loader).where(eq(Loader.id, loaderId)).execute()

  // Enqueue job to BullMQ
  const queue = useBullMQ('embedJobs')
  await queue.add('processJob', { jobId: packId })

  return { loader }
})
