import { z } from 'zod'
import { embedderDb, Loader } from 'embedder-db-pg'
import { and, eq } from 'drizzle-orm'
import { createLoader } from '@magickml/embedder/loaders/core'

export default defineEventHandler(async event => {
  const packId = z.string().parse(event.context.params?.id)
  const loaderId = z.string().parse(event.context.params?.loaderId)

  const loader = await embedderDb
    .select()
    .from(Loader)
    .where(and(eq(Loader.packId, packId), eq(Loader.id, loaderId)))
    .execute()
    .then(results => results[0])

  if (!loader) {
    throw createError({
      statusCode: 404,
      message: 'Loader not found',
    })
  }
  
  const chunkGenerator = createLoader(loader).getChunks()

  const chunksArray: string[] = []

  for await (const chunk of chunkGenerator) {
    chunksArray.push(chunk.pageContent)
  }

  return { chunks: chunksArray }
})
