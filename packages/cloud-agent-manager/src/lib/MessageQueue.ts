export type JobType = "agent:updated"
export type Job = CreateAgentJob
export interface CreateAgentJob {
    agentId: string
}


export interface MessageQueue {
    addJob(jobType: JobType, job: Job, jobId?: string): Promise<void>
}
