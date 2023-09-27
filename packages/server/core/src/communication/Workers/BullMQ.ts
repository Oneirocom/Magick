import { Worker as BMQWorker } from 'bullmq'
import { type Job, app } from 'server/core'
import { Worker } from './Worker'

export class BullMQWorker extends Worker {
  declare worker: BMQWorker

  constructor() {
    super()
  }

  initialize(
    queueName: string,
    callback: (job: Job<any>) => Promise<any>
  ): void {
    const connection = app.get('redis')
    this.worker = new BMQWorker(queueName, callback, {
      connection,
      concurrency: 10,
    })
  }
}
