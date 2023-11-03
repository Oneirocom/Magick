import { Worker as BMQWorker, Job } from 'bullmq'
import { app } from '../../app'
import { Worker } from './Worker'

export class BullMQWorker extends Worker {
  declare worker: BMQWorker

  constructor() {
    super()
  }

  override initialize(
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
