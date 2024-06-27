import { info } from '@magickml/embedder-config'
import { ConnectionOptions, Queue } from 'bullmq'
import { RAGApplicationBuilder } from '@llm-tools/embedjs'
// import { RedisCache } from './redis-cache'

import consola from 'consola'
import { JsonValue } from 'type-fest'
import { embedderDb, Job, Loader } from '@magickml/embedder-db-pg'
import { usePineconeDb } from '@magickml/embedder-db-pinecone'
import { createLoader } from '@magickml/embedder-loaders-core'
import { JobStatusType } from '@magickml/embedder-schemas'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const useTLS = process.env['EMBEDDER_REDIS_TLS'] === 'true'

const connection: ConnectionOptions = {
  host: process.env['EMBEDDER_REDIS_HOST'] || 'localhost',
  port: Number(process.env['EMBEDDER_REDIS_PORT']) || 6379,
  username: process.env['EMBEDDER_REDIS_USERNAME'],
  password: process.env['EMBEDDER_REDIS_PASSWORD'],
  tls: useTLS ? {} : undefined,
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
      const { type, ...rest } = loader
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

      // update the loader status
      await embedderDb
        .update(Loader)
        .set({ status: 'completed', raw: JSON.stringify(res.raw) })
        .where(eq(Loader.id, loader.id))
        .execute()

      //update the loader in the job
      await embedderDb
        .update(Job)
        .set({
          loaders: loaders.map((l: Loader) =>
            l.id === loader.id ? { ...l, status: 'completed' } : l
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
