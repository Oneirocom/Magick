export type JobType = "create-agent"
export type Job = any

export interface MessageQueue {
    addJob(jobType: JobType, job: Job): Promise<void>
}
