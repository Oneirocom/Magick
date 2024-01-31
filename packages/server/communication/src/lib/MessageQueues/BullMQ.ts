import { Queue } from 'bullmq'
import pino from 'pino'
import Redis from 'ioredis'

import { getLogger } from 'server/logger'

import { MessageQueue } from './MessageQueue'

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

  async addJob<AgentJob = any>(jobName: string, job: AgentJob, jobId?: string) {
    this.logger.info(`Adding job ${jobName} to queue ${this.queue.name}...`)
    await this.queue.add(jobName, job, { jobId })
    this.logger.info(`Added job ${jobName} to queue ${this.queue.name}`)
  }

  async close(): Promise<void> {
    await this.queue.close()
  }
}
