import { Job, Worker as BMQWorker } from 'bullmq'
import { app } from '@magickml/server-core'
import { Worker } from './Worker'

export class BullMQWorker extends Worker {
    worker: BMQWorker

    constructor() {
        super()
    }

    initialize(queueName: string, callback: (job: Job) => Promise<any>): void {
        this.worker = new BMQWorker(queueName, callback, {
            connection: app.get('redis')
        })
    }
}
