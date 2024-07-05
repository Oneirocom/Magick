import { z } from 'zod'
import { embedderDb, Loader } from '@magickml/embedder-db-pg'
import { and, eq } from 'drizzle-orm'
import { createLoader } from '@magickml/embedder-loaders-core'
import { Storage } from '@google-cloud/storage'
import {
  LoaderWithChunks,
  LoaderSchema,
  LoaderConfigSchema,
} from '@magickml/embedder-schemas'

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
  const packId = z.string().parse(event.context.params?.id)
  const loaderId = z.string().parse(event.context.params?.loaderId)

  const loader = await embedderDb
    .select()
    .from(Loader)
    .where(and(eq(Loader.packId, packId), eq(Loader.id, loaderId)))
    .execute()
    .then(results => LoaderSchema.parse(results[0]))

  if (!loader) {
    throw createError({
      statusCode: 404,
      message: 'Loader not found',
    })
  }

  const url = await generateV4ReadSignedUrl(
    process.env.GOOGLE_PRIVATE_BUCKET_NAME || '',
    (loader.config as any).filePathOrUrl || ''
  )

  const updatedConfig = {
    ...loader.config,
    ...(url && { filePathOrUrl: url }),
  }

  const validatedConfig = LoaderConfigSchema.parse(updatedConfig)

  const chunkGenerator = createLoader({
    ...loader,
    config: validatedConfig,
  }).getChunks()

  const chunksArray: string[] = []

  for await (const chunk of chunkGenerator) {
    chunksArray.push(chunk.pageContent)
  }

  const response = {
    ...loader,
    config: validatedConfig,
    chunks: chunksArray,
  }

  return LoaderWithChunks.parse(response)
})
