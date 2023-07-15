import { Job, Worker as BMQWorker } from 'bullmq'
import { Worker } from './Worker'
import { bullMQConnection } from '@magickml/config'

export class BullMQWorker extends Worker {
    worker: BMQWorker

    constructor() {
        super()
    }

    initialize(queueName: string, callback: (job: Job) => Promise<any>): void {
        this.worker = new BMQWorker(queueName, callback, {
            connection: bullMQConnection
        })
    }
}
