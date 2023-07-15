import BullMQ from 'bullmq'
import { Worker } from '.'
import { bullMQConnection } from '@magickml/config'

export class BullMQWorker extends Worker {
    worker: BullMQ.Worker

    constructor() {
        super()
    }

    initialize(queueName: string, callback: (job: BullMQ.Job) => Promise<any>): void {
        this.worker = new BullMQ.Worker(queueName, callback, {
            connection: bullMQConnection
        })
    }
}
