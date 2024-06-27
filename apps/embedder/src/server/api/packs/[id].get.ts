import { FindPackResponseSchema, idParse } from '@magickml/embedder-schema'
import { embedderDb } from '@magickml/embedder-db-pg'

export default defineEventHandler(async event => {
  const packId = idParse(event.context.params?.id)

  const packWithLoaders = await embedderDb.query.Pack.findFirst({
    where: (pack, { eq }) => eq(pack.id, packId),
    with: {
      loaders: true,
    },
  })

  if (!packWithLoaders) {
    throw createError({
      statusCode: 404,
      message: 'Pack not found',
    })
  }

  return FindPackResponseSchema.parse(packWithLoaders)
})
