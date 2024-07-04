import { err, info } from '@magickml/embedder-config'
import {
  processEmbedJob,
  processDeleteLoaderJob,
} from '@magickml/embedder-queue'
import { Worker } from 'bullmq'
import { defineNitroPlugin } from 'nitropack/runtime'
import { ConnectionOptions } from 'bullmq'

const useTLS = process.env['EMBEDDER_REDIS_TLS'] === 'true'

const connection: ConnectionOptions = {
  host: process.env['EMBEDDER_REDIS_HOST'] || 'localhost',
  port: Number(process.env['EMBEDDER_REDIS_PORT']) || 6379,
  username: process.env['EMBEDDER_REDIS_USERNAME'],
  password: process.env['EMBEDDER_REDIS_PASSWORD'],
  tls: useTLS ? {} : undefined,
}

export const embedderWorkerPlugin = defineNitroPlugin(() => {
  const queueName = 'embedJobs'

  type ProcessJobData = { jobId: string }
  type DeleteLoaderData = { loaderId: string; path: string }

  const worker = new Worker<
    ProcessJobData | DeleteLoaderData,
    void,
    'processJob' | 'deleteLoader'
  >(
    queueName,
    async job => {
      if (job.name === 'processJob') {
        const { jobId } = job.data as ProcessJobData
        console.log(`Processing job ${job.id}`)
        try {
          await processEmbedJob(jobId)
        } catch (error) {
          err(`Error processing job ${job.id}`, error)
        }
      } else if (job.name === 'deleteLoader') {
        const { loaderId, path } = job.data as DeleteLoaderData
        console.log(`Deleting loader ${loaderId}`)
        try {
          await processDeleteLoaderJob(loaderId, path)
        } catch (error) {
          err(`Error deleting loader ${loaderId}`, error)
        }
      }
    },
    { connection }
  )

  worker.on('completed', job => {
    info(`Job ${job.id} has been completed`)
  })

  worker.on('failed', (job, errr) => {
    err(`Job ${job?.id} has failed with error: ${errr.message}`)
  })

  info('BullMQ worker initialized')
})
