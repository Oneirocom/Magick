import { z } from 'zod'
import { RAGApplicationBuilder } from '@llm-tools/embedjs'
import { embedderDb, Pack } from 'embedder-db-pg'
import { usePineconeDb } from '@magickml/embedder/db/pinecone'
import { eq } from 'drizzle-orm'
import { authParse } from '@magickml/embedder/schema'

const QuerySchema = z.object({
  query: z.string(),
})

export default defineEventHandler(async event => {
  const { owner, entity } = authParse(event.headers)
  const packId = z.string().parse(event.context.params?.id)
  const body = await readBody(event)
  const { query } = QuerySchema.parse(body)

  const knowledgePack = await embedderDb
    .select()
    .from(Pack)
    .where(eq(Pack.id, packId))
    .execute()
    .then(results => results[0])

  const app = await new RAGApplicationBuilder()
    .setVectorDb(
      usePineconeDb({
        entity: entity,
        packId: packId,
      })
    )
    .build()

  return await app.getContext(query)
})
