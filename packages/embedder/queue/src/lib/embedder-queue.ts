import { info } from '@magickml/embedder-config'
import { ConnectionOptions, Queue } from 'bullmq'
import { RAGApplicationBuilder } from '@llm-tools/embedjs'
// import { RedisCache } from './redis-cache'

import consola from 'consola'
import { JsonValue } from 'type-fest'
import { embedderDb, Job, Loader, Pack } from '@magickml/embedder-db-pg'
import { usePineconeDb } from '@magickml/embedder-db-pinecone'
import { createLoader } from '@magickml/embedder-loaders-core'
import { JobStatusType } from '@magickml/embedder-schemas'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { Storage } from '@google-cloud/storage'

const useTLS = process.env['EMBEDDER_REDIS_TLS'] === 'true'

const connection: ConnectionOptions = {
  host: process.env['EMBEDDER_REDIS_HOST'] || 'localhost',
  port: Number(process.env['EMBEDDER_REDIS_PORT']) || 6379,
  username: process.env['EMBEDDER_REDIS_USERNAME'],
  password: process.env['EMBEDDER_REDIS_PASSWORD'],
  tls: useTLS ? {} : undefined,
}

const storage = new Storage({
  projectId: process.env['GOOGLE_CLOUD_PROJECT_ID'],
  credentials: {
    client_email: process.env['GOOGLE_CLOUD_CLIENT_EMAIL'],
    private_key: process.env['GOOGLE_CLOUD_PRIVATE_KEY']?.replace(/\\n/g, '\n'),
  },
})

async function deleteFileFromStorage(bucketName: string, fileName: string) {
  try {
    consola.log(
      `Attempting to delete file from bucket: ${bucketName}, file: ${fileName}`
    )
    const [metadata] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getMetadata()

    consola.log(`File metadata retrieved: ${JSON.stringify(metadata)}`)

    const generation = metadata.generation
    await storage.bucket(bucketName).file(fileName).delete({
      ifGenerationMatch: generation,
    })

    consola.success(`File ${fileName} deleted successfully from Cloud Storage.`)
  } catch (error: any) {
    if (error?.code === 412) {
      consola.error(
        `File ${fileName} has been modified since last read. Deletion aborted.`
      )
    } else {
      consola.error(
        `Failed to delete file ${fileName} from Cloud Storage:`,
        error
      )
    }
  }
}

export function useBullMQ(queueName: string) {
  const queue = new Queue(queueName, { connection })

  return {
    async enqueue(jobId: string) {
      await queue.add(queueName, { jobId })
      info(`Enqueued job ${jobId}`)
    },
    async add(jobName: string, payload: object) {
      await queue.add(jobName, payload)
      info(`Added job ${jobName} with payload ${JSON.stringify(payload)}`)
    },
    async getAllJobIds() {
      const jobs = await queue.getJobs(
        ['waiting', 'active', 'completed', 'failed', 'delayed'],
        0,
        -1
      )
      return jobs.map(job => job.id)
    },
    async getJobIdsForEntity(entityId: string) {
      const jobs = await queue.getJobs(
        ['waiting', 'active', 'completed', 'failed', 'delayed'],
        0,
        -1
      )

      return jobs
        .filter(job => job.data.entityId === entityId)
        .map(job => job.id)
    },
    async addJobIdToEntity(jobId: string, entityId: string) {
      await queue.add(queueName, { jobId, entityId })
    },
  }
}

type Loader = any // TODO: post db package setup

export async function createJob(job: {
  entity: string
  pack: string
  loaders: JsonValue[]
}) {
  const createdJob = await embedderDb
    .insert(Job)
    .values({
      id: randomUUID(),
      entity: job.entity,
      packId: job.pack,
      loaders: job.loaders,
      status: 'pending',
      createdAt: new Date().toISOString(), // Ensure this is a string
    })
    .returning()
    .execute()

  consola.info(`Created job with ID: ${createdJob[0].id}`)
  await useBullMQ('embedJobs').add('processJob', { jobId: createdJob[0].id })
  return createdJob[0]
}

export async function createDeleteLoaderJob(loaderId: string, path: string) {
  await useBullMQ('embedJobs').add('deleteLoader', { loaderId, path })
  consola.info(`Delete loader job created for loader ${loaderId}`)
}

export async function createDeletePackJob(packId: string) {
  await useBullMQ('embedJobs').add('deletePack', { packId })
  consola.info(`Delete pack job created for pack ${packId}`)
}

function extractRelevantPathAndFileName(url: string) {
  const urlRegex = /https:\/\/storage\.googleapis\.com\/[^/]+\/(.+)\?/
  const match = url.match(urlRegex)

  if (match) {
    const relevantPath = decodeURIComponent(match[1])
    const fileName = relevantPath.split('/').pop() || ''
    return { relevantPath, fileName }
  }

  return { relevantPath: null, fileName: null }
}

export async function processDeleteLoaderJob(
  loaderId: string,
  filePath: string
) {
  try {
    // Delete the loader from the database
    await embedderDb.delete(Loader).where(eq(Loader.id, loaderId)).execute()
    consola.info(`Loader ${loaderId} deleted successfully`)
    // Delete the loader's file from Cloud Storage
    await deleteFileFromStorage(
      process.env['GOOGLE_PRIVATE_BUCKET_NAME'] || '',
      filePath || ''
    )
    consola.info(`Cloud Storage file ${filePath} deleted successfully`)
  } catch (error) {
    consola.error(`Error deleting loader ${loaderId}:`, error)
  }
}

export async function processDeletePackJob(packId: string) {
  try {
    // Fetch all loaders associated with the pack
    const loaders = await embedderDb
      .select()
      .from(Loader)
      .where(eq(Loader.packId, packId))
      .execute()

    // Delete each loader and its file
    for (const loader of loaders) {
      const { filePathOrUrl } = loader.config as any // Adjust the property name as needed
      if (filePathOrUrl) {
        await deleteFileFromStorage(
          process.env['GOOGLE_PRIVATE_BUCKET_NAME'] || '',
          filePathOrUrl || ''
        )
      }
      await embedderDb.delete(Loader).where(eq(Loader.id, loader.id)).execute()
      consola.info(`Loader ${loader.id} deleted successfully`)
    }

    // Delete the pack from the database
    await embedderDb.delete(Pack).where(eq(Pack.id, packId)).execute()
    consola.info(`Pack ${packId} deleted successfully`)
  } catch (error) {
    consola.error(`Error deleting pack ${packId}:`, error)
  }
}
export async function processEmbedJob(jobId: string) {
  // tood: just pass job in instead of db call
  const job = await embedderDb
    .select()
    .from(Job)
    .where(eq(Job.id, jobId))
    .execute()
    .then(results => results[0])

  if (!job) {
    throw new Error(`Job ${jobId} not found`)
  }

  consola.info(`Processing job ${jobId}`)

  const loaders = job.loaders as Loader[]

  try {
    const pineconeDbInstance = usePineconeDb({
      entity: job.entity,
      packId: job.packId,
    })
    // const cacheInstance = new RedisCache({ host: 'localhost', port: 6379 })

    const app = await new RAGApplicationBuilder()
      .setVectorDb(pineconeDbInstance)
      // .setCache(cacheInstance as any) // TODO: Ensure this cache is namespaces correctly.
      .build()

    for (const loader of loaders) {
      const { type } = loader
      consola.info(
        `[processEmbedJob] type: ${type}, loader: ${JSON.stringify(
          loader,
          null,
          2
        )}`
      )
      const res = await app.addLoader(createLoader(loader))

      consola.success(
        `[processEmbedJob] Loader added: ${JSON.stringify(res.raw, null, 2)}`
      )

      const { relevantPath } = extractRelevantPathAndFileName(
        loader.config.filePathOrUrl
      )

      // update the loader status
      await embedderDb
        .update(Loader)
        .set({
          status: 'completed',
          raw: JSON.stringify(res.raw),
          config: { ...loader.config, filePathOrUrl: relevantPath },
        })
        .where(eq(Loader.id, loader.id))
        .execute()

      //update the loader in the job
      await embedderDb
        .update(Job)
        .set({
          loaders: loaders.map((l: Loader) =>
            l.id === loader.id
              ? {
                  ...l,
                  status: 'completed',
                }
              : l
          ),
        })
        .where(eq(Job.id, jobId))
        .execute()
    }

    // update the job status
    await embedderDb
      .update(Job)
      .set({ status: 'completed', finishedAt: new Date().toISOString() })
      .where(eq(Job.id, jobId))
      .execute()
  } catch (error) {
    consola.error(`!Error processing job ${jobId}:`, error)
    await embedderDb
      .update(Job)
      .set({ status: 'failed' })
      .where(eq(Job.id, jobId))
      .execute()
    throw error
  }
}

export async function updateJobStatus(jobId: string, status: string) {
  const job = await embedderDb
    .select()
    .from(Job)
    .where(eq(Job.id, jobId))
    .execute()
    .then(results => results[0])

  if (job) {
    await embedderDb
      .update(Job)
      .set({ status: status as JobStatusType })
      .where(eq(Job.id, jobId))
      .execute()
  } else {
    consola.warn(`Job ${jobId} not found while updating status`)
  }
}

export async function getAllJobs() {
  const jobs = await embedderDb.select().from(Job).execute()
  return jobs
}

export async function getJobsForEntity(entityId: string) {
  const jobs = await embedderDb
    .select()
    .from(Job)
    .where(eq(Job.packId, entityId))
    .execute()
  return jobs
}

export async function getJobById(jobId: string) {
  const job = await embedderDb
    .select()
    .from(Job)
    .where(eq(Job.id, jobId))
    .execute()
    .then(results => results[0])
  return job
}
