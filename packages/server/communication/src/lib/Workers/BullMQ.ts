import { Worker as BMQWorker, Job } from 'bullmq'
import Redis from 'ioredis'
import { Worker } from './Worker'

export class BullMQWorker<T = any> extends Worker {
  declare worker: BMQWorker
  connection: Redis

  constructor(connection: Redis) {
    super()
    this.connection = connection
  }

  override initialize(
    queueName: string,
    callback: (job: Job<T>) => Promise<any>
  ): void {
    this.worker = new BMQWorker(queueName, callback, {
      connection: this.connection,
      concurrency: 10,
    })
  }
}
