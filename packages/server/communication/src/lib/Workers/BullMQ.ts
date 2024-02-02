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
      removeOnComplete: { count: 1000 },
      removeOnFail: { count: 5000 },
    })
  }

  async close(): Promise<void> {
    this.worker.close(true)
  }
}
