import { JobSchema } from '@magickml/embedder/schema'
import { embedderDb } from 'embedder-db-pg'

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing id',
    })
  }

  const job = await embedderDb.query.Job.findFirst({
    where: (job, { eq }) => eq(job.id, id),
  })

  if (!job) {
    throw createError({
      statusCode: 404,
      message: 'Job not found',
    })
  }

  // Do something with id

  console.log('Job:', job)

  // return job
  return JobSchema.parse(job)
})
