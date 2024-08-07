import { Job, Queue } from 'bullmq'
import pino from 'pino'
import Redis from 'ioredis'

import { getLogger } from '@magickml/server-logger'

import { MessageQueue } from './MessageQueue'

export type BullMQJob = Job<any, any, string>

export class BullQueue implements MessageQueue {
  logger: pino.Logger = getLogger()
  declare queue: Queue
  declare connection: Redis

  constructor(connection: Redis) {
    this.connection = connection
  }

  initialize(queueName: string): void {
    this.queue = new Queue(queueName, {
      connection: this.connection,
    })
  }

  async getWaitingJobs<J>() {
    return this.queue.getWaiting() as J
  }

  async addJob<AgentJob = any>(jobName: string, job: AgentJob, jobId?: string) {
    // this.logger.info(`Adding job ${jobName} to queue ${this.queue.name}...`)
    await this.queue.add(jobName, job, {
      jobId,
      removeOnComplete: 1000,
      removeOnFail: 5000,
    })
    // this.logger.info(`Added job ${jobName} to queue ${this.queue.name}`)
  }

  async close(): Promise<void> {
    await this.queue.close()
  }
}
