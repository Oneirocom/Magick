import { embedderDb, Pack } from 'embedder-db-pg'
import { eq, and } from 'drizzle-orm'
import { authParse } from '@magickml/embedder/schema'

export default defineEventHandler(async event => {
  const { entity, owner } = authParse(event.context)

  const packs = await embedderDb
    .select()
    .from(Pack)
    .where(and(eq(Pack.entity, entity), eq(Pack.owner, owner)))
    .execute()

  return packs
})
