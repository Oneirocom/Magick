import { z } from 'zod'
import { embedderDb, Loader } from '@magickml/embedder-db-pg'
import { and, eq } from 'drizzle-orm'
import { createLoader } from '@magickml/embedder-loaders-core'
import { Storage } from '@google-cloud/storage'
import {
  LoaderWithChunks,
  LoaderSchema,
  LoaderType,
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

function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
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
    let sourceField: string | undefined
    let needsSignedUrl = false

    switch (loader.type as LoaderType) {
      case 'pdf':
      case 'docx':
      case 'excel':
      case 'ppt':
        sourceField = 'filePathOrUrl'
        needsSignedUrl = true
        break
      case 'web':
        sourceField = 'urlOrContent'
        break
      case 'youtube':
        sourceField = 'videoIdOrUrl'
        break
      case 'sitemap':
        sourceField = 'url'
        break
      // Add other cases as needed
    }

    let url = sourceField ? (loader.config as any)[sourceField] : undefined

    if (needsSignedUrl && url && !isValidUrl(url)) {
      try {
        url = await generateV4ReadSignedUrl(
          process.env.GOOGLE_PRIVATE_BUCKET_NAME || '',
          url
        )
      } catch (error) {
        console.error('Error generating signed URL:', error)
        // Handle the error gracefully
      }
    }

    let config = { ...loader.config }
    if (sourceField && url) {
      config = {
        ...config,
        [sourceField]: url,
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
