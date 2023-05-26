import { Queue } from "bullmq"
import pino from "pino"
import { getLogger } from "@magickml/core"

import { MessageQueue, Job, JobType } from "../MessageQueue"

export class BullQueue implements MessageQueue {
    logger: pino.Logger = getLogger()
    queue: Queue

    constructor(queue_name: string) {
        this.queue = new Queue(queue_name, {
            connection: {
                host: "localhost",
                port: 6379,
            }
        })
    }

    async addJob(jobType: JobType, job: Job, jobId?: string) {
        this.logger.info(`Adding job ${jobType} to queue ${this.queue.name}...`)
        await this.queue.add(jobType, job, { jobId })
        this.logger.info(`Added job ${jobType} to queue ${this.queue.name}`)
    }
}
