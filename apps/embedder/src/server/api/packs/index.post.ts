import {
  authParse,
  CreatePackRequestSchema,
  CreatePackResponseSchema,
} from '@magickml/embedder-schemas'
import { randomUUID } from 'crypto'
import { embedderDb, Pack } from '@magickml/embedder-db-pg'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async event => {
  console.log('VALIDATING AUTH')
  const { entity, owner } = authParse(event.context)

  const paredInput = CreatePackRequestSchema.parse(await readBody(event))

  const insertedPack = await embedderDb
    .insert(Pack)
    .values({
      id: randomUUID(),
      ...paredInput,
      owner,
      entity,
    })
    .returning()
    .execute()
    .then(results => results[0])

  console.log('insertedPack', insertedPack)

  const parsedOutput = CreatePackResponseSchema.parse(insertedPack)
  console.log('parsedOutput', parsedOutput)

  return parsedOutput
})
