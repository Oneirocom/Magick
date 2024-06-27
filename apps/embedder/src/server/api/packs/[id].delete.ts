import { idParse } from '@magickml/embedder-schema'
import { embedderDb, Pack } from '@magickml/embedder-db-pg'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async event => {
  return await embedderDb
    .delete(Pack)
    .where(eq(Pack.id, idParse(event.context.params?.id)))
    .returning()
    .execute()
    .then(results => results[0])
})
