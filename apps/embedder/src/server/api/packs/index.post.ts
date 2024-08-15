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
  try {
    const { entity, owner } = authParse(event.context)

    const parsedInput = CreatePackRequestSchema.parse(await readBody(event))

    const insertedPack = await embedderDb
      .insert(Pack)
      .values({
        id: randomUUID(),
        ...parsedInput,
        owner,
        entity,
      })
      .returning()
      .execute()
      .then(results => results[0])

    console.log('insertedPack', insertedPack)

    const parsedOutput = CreatePackResponseSchema.parse(insertedPack)

    return parsedOutput
  } catch (error) {
    console.error('Error in handler:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: error,
    })
  }
})
