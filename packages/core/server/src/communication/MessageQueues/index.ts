import { AgentJob } from '@magickml/agents'

interface UpdateJobArgs {
    agentId: string
}
export const UPDATE_JOB = ({ agentId }: UpdateJobArgs) => `agent:${agentId}:update`


interface RunJobArgs {
    agentId: string
}
export const RUN_JOB = ({ agentId }: RunJobArgs) => `agent:${agentId}:run`

export interface CreateAgentJob {
    jobId: string
    agentId: string
}

export interface MessageQueue {
    addJob(jobType: string, job: AgentJob, jobId?: string): Promise<void>
}
