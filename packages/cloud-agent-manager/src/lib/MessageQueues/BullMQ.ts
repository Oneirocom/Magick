import { Queue } from "bullmq"

import { MessageQueue, Job, JobType } from "../MessageQueue"
import { logger } from "../Logger"

export class BullQueue implements MessageQueue {
    queue: Queue

    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, {
            connection: {
                host: "localhost",
                port: 6379,
            }
        })
    }

    async addJob(jobType: JobType, job: Job) {
        logger.info(`Adding job ${jobType} to queue ${this.queue.name}`)
        await this.queue.add(jobType, job)
        logger.info(`Added job ${jobType} to queue ${this.queue.name}`)
    }
}
