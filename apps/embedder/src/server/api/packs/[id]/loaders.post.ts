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
import { Storage } from '@google-cloud/storage'
import { createError, defineEventHandler, readBody } from 'h3'

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
})

async function generateV4ReadSignedUrl(bucketName: string, fileName: string) {
  // Get a v4 signed URL for reading the file
  const [url] = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    })
  return url
}

export default defineEventHandler(async event => {
  // validate
  const parse = AddLoaderSchema.safeParse(await readBody(event))
  if (!parse.success) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    })
  }

  let url
  if (parse.data.isUpload) {
    if (!parse.data.path) {
      throw createError({
        statusCode: 400,
        message: 'Missing path for upload',
      })
    }

    url = await generateV4ReadSignedUrl(
      process.env.GOOGLE_PRIVATE_BUCKET_NAME || '',
      parse.data.path
    )

    // set the loaders filePathOrUrl to the signed URL
    if ('filePathOrUrl' in parse.data.config) {
      parse.data.config.filePathOrUrl = url
    } else {
      // 'filePathOrUrl' should cover all cases
      // if we get here its probably a youtube/etc/etc loader
      throw createError({
        statusCode: 400,
        message: 'Invalid loader type with isUpload',
      })
    }
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
  // remove isUpload and path from the loader config
  delete parse.data.isUpload
  delete parse.data.path

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
