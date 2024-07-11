import { z } from 'zod'
import { embedderDb, Loader } from '@magickml/embedder-db-pg'
import { and, eq } from 'drizzle-orm'
import { createLoader } from '@magickml/embedder-loaders-core'
import { Storage } from '@google-cloud/storage'
import { LoaderWithChunks, LoaderSchema } from '@magickml/embedder-schemas'

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

  if (loader.status === 'completed') {
    let url

    // Generate signed URL for private bucket
    try {
      url = await generateV4ReadSignedUrl(
        process.env.GOOGLE_PRIVATE_BUCKET_NAME || '',
        (loader.config as any).filePathOrUrl || ''
      )
    } catch (error) {
      console.error('Error getting loader:', error)
    }

    let config = loader.config

    if (url) {
      url = (loader.config as any).filePathOrUrl

      config = {
        ...(loader.config as any),
        ...(url && { filePathOrUrl: url }),
      }
    }

    const chunkGenerator = createLoader({
      ...loader,
      config,
    }).getChunks()

    const chunksArray: string[] = []

    for await (const chunk of chunkGenerator) {
      chunksArray.push(chunk.pageContent)
    }

    const response = {
      ...loader,
      config,
      chunks: chunksArray,
    }

    return LoaderWithChunks.parse(response)
  }

  return LoaderWithChunks.parse({
    ...loader,
    chunks: [],
  })
})
