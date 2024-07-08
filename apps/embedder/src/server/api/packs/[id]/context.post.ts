import { z } from 'zod'
import { RAGApplicationBuilder } from '@llm-tools/embedjs'
import { embedderDb, Pack } from '@magickml/embedder-db-pg'
import { usePineconeDb } from '@magickml/embedder-db-pinecone'
import { eq, and } from 'drizzle-orm'
import {
  authParse,
  PackQueryRequestSchema,
  PackQueryContextSchema,
} from '@magickml/embedder-schemas'
import { createError } from 'h3'

export default defineEventHandler(async event => {
  const { owner, entity } = authParse(event.context)
  const packId = z.string().parse(event.context.params?.id)
  const body = await readBody(event)
  const { query } = PackQueryRequestSchema.parse(body)

  const knowledgePack = await embedderDb
    .select()
    .from(Pack)
    .where(
      and(eq(Pack.id, packId), eq(Pack.entity, entity), eq(Pack.owner, owner))
    )
    .execute()
    .then(results => results[0])

  if (!knowledgePack) {
    throw createError({
      statusCode: 404,
      message: 'Knowledge Pack not found',
    })
  }

  const app = await new RAGApplicationBuilder()
    .setVectorDb(
      usePineconeDb({
        entity: entity,
        packId: packId,
      })
    )
    .build()

  const context = await app.getContext(query)

  return PackQueryContextSchema.parse(context)
})
