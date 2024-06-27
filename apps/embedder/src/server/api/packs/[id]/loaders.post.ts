import {
  AddLoaderResponseSchema,
  AddLoaderSchema,
  authParse,
  idParse,
} from '@magickml/embedder-schemas'
import { embedderDb, Loader, Pack } from '@magickml/embedder-db-pg'
import { eq, and } from 'drizzle-orm'
import { useBullMQ, createJob } from '@magickml/embedder-queue'
import { randomUUID } from 'crypto'

export default defineEventHandler(async event => {
  // validate
  const parse = AddLoaderSchema.safeParse(await readBody(event))
  if (!parse.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    })
  }

  const { entity, owner } = authParse(event.context)
  const id = idParse(event.context.params?.id)

  // get the pack
  const pack = await embedderDb
    .select()
    .from(Pack)
    .where(and(eq(Pack.id, id), eq(Pack.entity, entity), eq(Pack.owner, owner)))
    .execute()
    .then(results => results[0])

  if (!pack) {
    throw createError({
      statusCode: 404,
      message: 'Pack not found',
    })
  }

  // Serialize loader into DB
  const loader = await embedderDb
    .insert(Loader)
    .values({
      id: randomUUID(),
      ...parse.data,
      packId: pack.id,
      status: 'pending',
      meta: {},
      raw: {},
    })
    .returning()
    .execute()
    .then(results => results[0])

  if (!loader) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create loader',
    })
  }

  // Create a job and trigger the processing
  const job = await createJob({
    entity: pack.entity,
    pack: id,
    loaders: [loader as any],
  })

  if (!job) {
    throw createError({
      statusCode: 500,
      message:
        'Loader was created but failed to create job. Please try rerunning the loader.',
    })
  }

  // Enqueue job to BullMQ
  const queue = useBullMQ('embedJobs')
  await queue.add('processJob', { jobId: job.id })

  return AddLoaderResponseSchema.parse({
    status: loader.status,
    id: loader.id,
    jobId: job.id,
  })
})
