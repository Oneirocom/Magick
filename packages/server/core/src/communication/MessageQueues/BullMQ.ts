import { Queue } from 'bullmq'
import { app } from 'server/core'
import pino from 'pino'
import { getLogger } from 'shared/core'

import { MessageQueue } from '../MessageQueues'
import { AgentJob } from 'server/agents'

export class BullQueue implements MessageQueue {
  logger: pino.Logger = getLogger()
  declare queue: Queue

  initialize(queueName: string): void {
    this.queue = new Queue(queueName, {
      connection: app.get('redis'),
    })
  }

  async addJob(jobName: string, job: AgentJob, jobId?: string) {
    this.logger.info(`Adding job ${jobName} to queue ${this.queue.name}...`)
    await this.queue.add(jobName, job, { jobId })
    this.logger.info(`Added job ${jobName} to queue ${this.queue.name}`)
  }
}
